import { supabase } from '@/backend/common/utils/supabaseClient';
import {
  CommonHelpEntity,
  CommonHelpWithNicknameEntity,
} from '@/backend/helps/domains/entities/CommonHelpEntity';
import { ICommonHelpRepository } from '@/backend/helps/domains/repositories/ICommonHelpRepository';
import { HelpData } from '@/backend/helps/infrastructures/mappers/CommonHelpDataMapper';

// JOIN 결과 타입 정의
type CategoryJoinResult = {
  sub_category_id: number;
  sub_categories: {
    id: number;
    name: string;
    point: number;
    category_id: number;
    categories: {
      id: number;
      name: string;
    }[];
  };
};

type HelpWithSeniorData = HelpData & {
  senior?: {
    nickname: string;
  };
};

export class SbCommonHelpRepository implements ICommonHelpRepository {
  /**
   * help의 카테고리 정보를 조회하는 공통 메서드
   */
  private async getHelpCategories(
    helpId: number
  ): Promise<{ id: number; point: number }[]> {
    const { data: categoryData, error: categoryError } = await supabase
      .from('help_categories')
      .select(
        `
        sub_category_id,
        sub_categories!help_categories_sub_category_id_fkey(
          id,
          name,
          point,
          category_id,
          categories!sub_categories_category_id_fkey(
            id,
            name
          )
        )
      `
      )
      .eq('help_id', helpId);

    if (categoryError) {
      console.error(
        `[SbCommonHelpRepository] Help ${helpId} 카테고리 조회 오류:`,
        categoryError
      );
      return [];
    }

    const categories: { id: number; point: number }[] = [];
    if (categoryData) {
      (categoryData as unknown as CategoryJoinResult[]).forEach((item) => {
        if (item.sub_categories) {
          const subCategoryId = item.sub_categories.id;
          const point = item.sub_categories.point;
          if (
            subCategoryId !== undefined &&
            point !== undefined &&
            !categories.some((c) => c.id === subCategoryId)
          ) {
            categories.push({ id: subCategoryId, point });
          }
        }
      });
    }

    return categories;
  }

  /**
   * HelpData를 CommonHelpEntity로 변환하는 공통 메서드
   */
  private async createHelpEntity(help: HelpData): Promise<CommonHelpEntity> {
    const categories = await this.getHelpCategories(help.id);

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
  }

  /**
   * HelpData를 CommonHelpWithNicknameEntity로 변환하는 공통 메서드
   */
  private async createHelpWithNicknameEntity(
    help: HelpWithSeniorData
  ): Promise<CommonHelpWithNicknameEntity> {
    const categories = await this.getHelpCategories(help.id);

    return new CommonHelpWithNicknameEntity(
      help.id,
      help.senior_id,
      help.senior?.nickname || '알 수 없음',
      help.title,
      new Date(help.start_date),
      new Date(help.end_date),
      categories,
      help.content,
      help.status,
      new Date(help.created_at)
    );
  }

  async getHelpList(): Promise<CommonHelpEntity[] | null> {
    try {
      const { data, error } = await supabase.from('helps').select('*');

      if (!data || error) {
        console.error('[Repository] Supabase 헬프 리스트 조회 오류:', error);
        return Promise.reject(null);
      }

      const helpEntities = await Promise.all(
        data.map((help: HelpData) => this.createHelpEntity(help))
      );

      return helpEntities;
    } catch (error) {
      console.error('[SbCommonHelpRepository] 헬프 리스트 조회 오류:', error);
      throw new Error(`헬프 리스트 조회 오류: ${error}`);
    }
  }

  async getHelpListWithNicknames(): Promise<
    CommonHelpWithNicknameEntity[] | null
  > {
    try {
      const { data, error } = await supabase.from('helps').select(`
          *,
          senior:users!helps_senior_id_fkey(nickname)
        `);

      if (!data || error) {
        console.error('[Repository] Supabase 헬프 리스트 조회 오류:', error);
        return Promise.reject(null);
      }

      const helpEntities = await Promise.all(
        (data as HelpWithSeniorData[]).map((help) =>
          this.createHelpWithNicknameEntity(help)
        )
      );

      return helpEntities;
    } catch (error) {
      console.error('[SbCommonHelpRepository] 헬프 리스트 조회 오류:', error);
      throw new Error(`헬프 리스트 조회 오류: ${error}`);
    }
  }

  async getHelpById(id: number): Promise<CommonHelpEntity | null> {
    try {
      const { data: helpData, error: helpError } = await supabase
        .from('helps')
        .select('*')
        .eq('id', id)
        .single();

      if (helpError || !helpData) return null;

      return await this.createHelpEntity(helpData);
    } catch (error) {
      console.error('[Repository] 헬프 상세 조회 오류:', error);
      throw new Error('헬프 상세 조회 오류');
    }
  }

  async getHelpByIdWithNickname(
    id: number
  ): Promise<CommonHelpWithNicknameEntity | null> {
    try {
      const { data: helpData, error: helpError } = await supabase
        .from('helps')
        .select(
          `
          *,
          senior:users!helps_senior_id_fkey(nickname)
        `
        )
        .eq('id', id)
        .single();

      if (helpError || !helpData) return null;

      return await this.createHelpWithNicknameEntity(
        helpData as HelpWithSeniorData
      );
    } catch (error) {
      console.error('[Repository] 헬프 상세 조회 오류:', error);
      throw new Error('헬프 상세 조회 오류');
    }
  }
}
