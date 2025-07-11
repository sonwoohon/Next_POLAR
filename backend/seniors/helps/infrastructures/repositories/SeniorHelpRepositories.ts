// Senior 도움 생성, 수정, 연결, 완료, help 조건부 삭제 관련 인프라스트럭처
// 이 파일에는 Senior 사용자의 도움 생성, 수정, 연결, 완료, help 조건부 삭제 관련 외부 의존성 구현이 포함됩니다.

import { supabase } from '@/backend/common/utils/supabaseClient';
import { SeniorHelp } from '@/backend/seniors/helps/domains/entities/SeniorHelp';
import { ISeniorHelpRepositoryInterface } from '@/backend/seniors/helps/domains/repositories/SeniorHelpRepositoryInterface';
import { UpdateHelpRequestWithHelpId } from '@/backend/seniors/helps/SeniorHelpModel';

type CategoryInput = number | number[];

const handleSupabaseError = (error: unknown, operation: string): never => {
  console.error(`${operation} 에러:`, error);
  const errorMessage =
    error instanceof Error ? error.message : '알 수 없는 오류';
  throw new Error(`${operation} 실패: ${errorMessage}`);
};

const normalizeCategoryIds = (category: CategoryInput): number[] => {
  return Array.isArray(category) ? category : [category];
};

const createHelpCategories = async (
  helpId: number,
  categoryIds: number[]
): Promise<void> => {
  if (categoryIds.length === 0) return;

  const helpCategoriesData = categoryIds.map((categoryId) => ({
    help_id: helpId,
    category_id: categoryId,
  }));

  const { error } = await supabase
    .from('help_categories')
    .insert(helpCategoriesData);

  if (error) {
    handleSupabaseError(error, '카테고리 관계 생성');
  }
};

const deleteHelpCategories = async (helpId: number): Promise<void> => {
  const { error } = await supabase
    .from('help_categories')
    .delete()
    .eq('help_id', helpId);

  if (error) {
    handleSupabaseError(error, '카테고리 관계 삭제');
  }
};

const deleteHelpApplicant = async (helpId: number): Promise<void> => {
  const { error } = await supabase
    .from('help_applicants')
    .delete()
    .eq('help_id', helpId);

  if (error) {
    handleSupabaseError(error, '주니어 삭제');
  }
};

export class SeniorHelpRepository implements ISeniorHelpRepositoryInterface {
  async createHelp(help: SeniorHelp, seniorId: number): Promise<number> {
    // 1. helps 테이블에 데이터 삽입
    const { data: helpData, error: helpError } = await supabase
      .from('helps')
      .insert([
        {
          senior_id: seniorId,
          title: help.title,
          start_date: help.startDate,
          end_date: help.endDate,
          content: help.content,
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
    } catch (error) {
      // 카테고리 관계 생성 실패 시 help도 삭제 (롤백)
      await supabase.from('helps').delete().eq('id', helpId);
      throw error;
    }

    return helpId;
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
}
