import { supabase } from '@/backend/common/utils/supabaseClient';
import { IHelpApplicantRepository } from '@/backend/helps/domains/repositories/IHelpApplicantRepository';

export class SbHelpApplicantRepository implements IHelpApplicantRepository {
  async getApplicantsByHelpId(helpId: number): Promise<{ nickname: string }[]> {
    // help_applicants에서 junior_id로 users 테이블 join
    const { data, error } = await supabase
      .from('help_applicants')
      .select('junior_id, juniors:nickname')
      .eq('help_id', helpId);

    if (error) throw new Error(error.message);

    // nickname만 추출
    return (data ?? []).map((row: any) => ({ nickname: row.juniors.nickname }));
  }
} 