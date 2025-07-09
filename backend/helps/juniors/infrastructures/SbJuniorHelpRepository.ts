import { supabase } from "@/lib/supabase";
import { IJuniorHelpRepository } from "../domains/repositories/IJuniorHelpRepository";
import { CommonHelpEntity } from "../../domains/entities/CommonHelpEntity";

interface HelpData {
  id: number;
  senior_id: number;
  title: string;
  start_date: string;
  end_date: string;
  category: number;
  content: string;
  status: string;
  created_at: string;
};

export class SbJuniorHelpRepository implements IJuniorHelpRepository {
  async getJuniorAppliedHelpList(juniorId: number): Promise<CommonHelpEntity[] | null> {
    try {
      const { data, error } = await supabase
        .from('help_applicants')
        .select(`
          *,
          helps (*)
        `)
        .eq('junior_id', juniorId);

      if (error || !data) {
        console.error('[SbJuniorHelpRepository] 주니어가 지원한 헬프 목록 조회 오류:', error);
        return Promise.reject(null);
      }

      return data.map((help: HelpData) => new CommonHelpEntity(
        help.id,
        help.senior_id,
        help.title,
        new Date(help.start_date),
        new Date(help.end_date),
        help.category,
        help.content,
        help.status,
        new Date(help.created_at)
      ));
    } catch (error) {
      console.error('[SbJuniorHelpRepository] 주니어가 지원한 헬프 목록 조회 오류:', error);
      throw new Error(`주니어가 지원한 헬프 목록 조회 오류: ${error}`);
    }
  }

  async applyHelp(juniorId: number, helpId: number): Promise<void | null> {
    try {
      const { error } = await supabase
        .from('help_applicants')
        .insert({
          junior_id: juniorId,
          help_id: helpId,
          is_accepted: false,
          applied_at: new Date().toISOString()
        });


      if (error) {
        console.error('[SbJuniorHelpRepository] 헬프 지원 오류:', error);
        return Promise.reject(null);
      }

      return Promise.resolve();

    } catch (error) {
      console.error('[SbJuniorHelpRepository] 헬프 지원 오류:', error);
      return Promise.reject(null);
    }
  }

  async cancelJuniorlHelp(juniorId: number, helpId: number): Promise<void | null> {
    try {
      const { error } = await supabase
        .from('help_applicants')
        .delete()
        .match({ junior_id: juniorId, help_id: helpId });

      if (error) {
        // 오류 처리
        console.error('[SbJuniorHelpRepository] 헬프 지원 취소 오류:', error);
        return Promise.reject(null);
      }
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }

  }
}