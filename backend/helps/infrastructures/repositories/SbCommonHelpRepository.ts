import { supabase } from '@/backend/common/utils/supabaseClient';
import { CommonHelpEntity } from '@/backend/helps/domains/entities/CommonHelpEntity';
import { ICommonHelpRepository } from '@/backend/helps/domains/repositories/ICommonHelpRepository';
import { HelpData } from '@/backend/helps/infrastructures/mappers/CommonHelpDataMapper';

export class SbCommonHelpRepository implements ICommonHelpRepository {
  async getHelpList(): Promise<CommonHelpEntity[] | null> {
    try {
      const { data, error } = await supabase.from('helps').select('*');

      if (!data || error) {
        console.error('[Repository] Supabase 헬프 리스트 조회 오류:', error);
        return Promise.reject(null);
      }

      return data.map(
        (help: HelpData) =>
          new CommonHelpEntity(
            help.id,
            help.senior_id, // UUID
            help.title,
            new Date(help.start_date),
            new Date(help.end_date),
            help.category,
            help.content,
            help.status,
            new Date(help.created_at)
          )
      );
    } catch (error) {
      console.error('[SbCommonHelpRepository] 헬프 리스트 조회 오류:', error);
      throw new Error(`헬프 리스트 조회 오류: ${error}`);
    }
  }

  async getHelpById(id: number): Promise<CommonHelpEntity | null> {
    try {
      const { data, error } = await supabase
        .from('helps')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) return null;

      return new CommonHelpEntity(
        data.id,
        data.senior_id, // UUID
        data.title,
        new Date(data.start_date),
        new Date(data.end_date),
        data.category,
        data.content,
        data.status,
        new Date(data.created_at)
      );
    } catch (error) {
      console.error('[Repository] 헬프 상세 조회 오류:', error);
      throw new Error('헬프 상세 조회 오류');
    }
  }
}
