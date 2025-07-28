// Senior 도움 생성, 수정, 연결, 완료, help 조건부 삭제 관련 인프라스트럭처
// 이 파일에는 Senior 사용자의 도움 생성, 수정, 연결, 완료, help 조건부 삭제 관련 외부 의존성 구현이 포함됩니다.

import { supabase } from '@/backend/common/utils/supabaseClient';
import { SeniorHelp } from '@/backend/seniors/helps/domains/entities/SeniorHelp';
import { ISeniorHelpRepositoryInterface } from '@/backend/seniors/helps/domains/repositories/SeniorHelpRepositoryInterface';
import { UpdateHelpRequestWithHelpId } from '@/backend/seniors/helps/SeniorHelpModel';
import { CommonHelpEntity } from '@/backend/helps/domains/entities/CommonHelpEntity';

type CategoryInput = number | number[];

// ===== 유틸리티 함수들 =====

// Supabase 에러 처리 함수
function handleSupabaseError(error: unknown, operation: string) {
  console.error(`[SeniorHelpRepository] ${operation} 중 Supabase 오류:`, error);
  const errorMessage =
    error instanceof Error ? error.message : '알 수 없는 오류';
  throw new Error(`${operation} 중 오류가 발생했습니다: ${errorMessage}`);
}

// 카테고리 ID 정규화 함수
function normalizeCategoryIds(category: CategoryInput): number[] {
  if (Array.isArray(category)) {
    return category;
  }
  return [category];
}

// 카테고리 관계 생성 함수
async function createHelpCategories(helpId: number, subCategoryIds: number[]) {
  const categoryData = subCategoryIds.map((subCategoryId) => ({
    help_id: helpId,
    sub_category_id: subCategoryId,
  }));

  const { data, error } = await supabase
    .from('help_categories')
    .insert(categoryData)
    .select();

  if (error) {
    console.error(`[createHelpCategories] 서브카테고리 관계 생성 실패:`, error);
    handleSupabaseError(error, '서브카테고리 관계 생성');
  }
}

// 카테고리 관계 삭제 함수
async function deleteHelpCategories(helpId: number) {
  const { error } = await supabase
    .from('help_categories')
    .delete()
    .eq('help_id', helpId);

  if (error) {
    handleSupabaseError(error, '카테고리 관계 삭제');
  }
}

// help_applicants 삭제 함수
async function deleteHelpApplicant(helpId: number) {
  const { error } = await supabase
    .from('help_applicants')
    .delete()
    .eq('help_id', helpId);

  if (error) {
    handleSupabaseError(error, 'help_applicants 삭제');
  }
}

export class SeniorHelpRepository implements ISeniorHelpRepositoryInterface {
  async createHelp(help: SeniorHelp, seniorId: string): Promise<number> {
    // 트랜잭션 시작
    const { data: helpData, error: helpError } = await supabase
      .from('helps')
      .insert([
        {
          senior_id: seniorId, // UUID
          title: help.title,
          start_date: help.startDate,
          end_date: help.endDate,
          content: help.content,
          status: help.status,
        },
      ])
      .select('id')
      .single();

    if (helpError) {
      handleSupabaseError(helpError, 'Help 생성');
    }
    if (!helpData) {
      throw new Error('Help 생성 실패: 데이터가 반환되지 않았습니다.');
    }

    const helpId = helpData.id;

    try {
      // 2. 카테고리 관계 생성
      const categoryIds = normalizeCategoryIds(help.category);
      await createHelpCategories(helpId, categoryIds);

      // 3. 이미지 URL들이 있다면 help_images 테이블에 저장
      if (help.imageFiles && help.imageFiles.length > 0) {
        const imageRecords = help.imageFiles.map((imageUrl) => ({
          help_id: helpId,
          image_url: imageUrl,
        }));

        const { error: imageError } = await supabase
          .from('help_images')
          .insert(imageRecords);

        if (imageError) {
          console.error(
            '[SeniorHelpRepository] 이미지 URL들 저장 실패:',
            imageError
          );
          // 이미지 저장 실패 시 help와 카테고리도 삭제 (롤백)
          await supabase.from('help_categories').delete().eq('help_id', helpId);
          await supabase.from('helps').delete().eq('id', helpId);
          throw new Error(
            `이미지 URL들 저장에 실패했습니다: ${imageError.message}`
          );
        }
      }

      return helpId;
    } catch (error) {
      // 카테고리 관계 생성 또는 이미지 저장 실패 시 help도 삭제 (롤백)
      console.error(
        `[SeniorHelpRepository] 트랜잭션 실패, 롤백 중 - HelpId: ${helpId}`,
        error
      );
      try {
        await supabase.from('help_categories').delete().eq('help_id', helpId);
        await supabase.from('helps').delete().eq('id', helpId);
      } catch (rollbackError) {
        console.error(
          `[SeniorHelpRepository] 롤백 중 오류 - HelpId: ${helpId}`,
          rollbackError
        );
      }
      throw error;
    }
  }

  async updateHelp(help: UpdateHelpRequestWithHelpId): Promise<number> {
    // 1. helps 테이블 업데이트
    const { data, error } = await supabase
      .from('helps')
      .update({
        title: help.title,
        start_date: help.startDate,
        end_date: help.endDate,
        content: help.content,
      })
      .eq('id', help.helpId)
      .select('id')
      .single();

    if (error) {
      handleSupabaseError(error, 'Help 수정');
    }
    if (!data) {
      throw new Error('Help 수정 실패: 데이터가 반환되지 않았습니다.');
    }

    // 2. 기존 카테고리 관계 삭제 후 새로운 관계 생성
    await deleteHelpCategories(help.helpId);
    const categoryIds = normalizeCategoryIds(help.category);
    await createHelpCategories(help.helpId, categoryIds);

    return data.id;
  }

  async deleteHelp(id: number): Promise<boolean> {
    // 1. help_categories 관계 먼저 삭제 (외래키 제약조건 때문에)
    await deleteHelpCategories(id);
    await deleteHelpApplicant(id);

    // 2. helps 테이블에서 삭제
    const { error } = await supabase.from('helps').delete().eq('id', id);

    if (error) {
      handleSupabaseError(error, 'Help 삭제');
    }

    return true;
  }

  async getHelpsBySeniorNickname(
    seniorNickname: string
  ): Promise<CommonHelpEntity[] | null> {
    try {
      // 1. 닉네임으로 UUID 조회
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('nickname', seniorNickname)
        .single();

      if (userError) {
        console.error('[SeniorHelpRepository] 사용자 조회 오류:', userError);
        return null;
      }

      if (!userData) {
        console.error(
          '[SeniorHelpRepository] 사용자를 찾을 수 없습니다:',
          seniorNickname
        );
        return null;
      }

      const seniorId = userData.id;

      // 2. 시니어가 작성한 헬프 조회
      const { data: helpsData, error: helpsError } = await supabase
        .from('helps')
        .select(
          `
          *,
          help_categories (
            sub_category_id,
            sub_categories (
              id,
              name,
              point,
              category_id,
              categories (
                id,
                name
              )
            )
          ),
          help_images (
            image_url
          )
        `
        )
        .eq('senior_id', seniorId)
        .order('created_at', { ascending: false });

      if (helpsError) {
        console.error('[SeniorHelpRepository] 헬프 조회 오류:', helpsError);
        return null;
      }

      if (!helpsData || helpsData.length === 0) {
        return [];
      }

      // 3. CommonHelpEntity로 변환
      const helps = helpsData.map((help: any) => {
        const categories =
          help.help_categories?.map((hc: any) => ({
            id: hc.sub_categories.id,
            point: hc.sub_categories.point,
          })) || [];

        return new CommonHelpEntity(
          help.id,
          help.senior_id,
          help.title,
          new Date(help.start_date),
          new Date(help.end_date),
          categories,
          help.content,
          help.status,
          new Date(help.created_at)
        );
      });

      return helps;
    } catch (error) {
      console.error('[SeniorHelpRepository] 시니어 헬프 조회 오류:', error);
      return null;
    }
  }
}
