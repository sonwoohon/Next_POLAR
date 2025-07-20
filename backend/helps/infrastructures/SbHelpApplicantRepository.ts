import { supabase } from '@/backend/common/utils/supabaseClient';
import { IHelpApplicantRepository } from '@/backend/helps/domains/repositories/IHelpApplicantRepository';
import { HelpApplicantEntity } from '@/backend/helps/domains/entities/HelpApplicant';

export class SbHelpApplicantRepository implements IHelpApplicantRepository {
  async getApplicantsByHelpId(helpId: number): Promise<HelpApplicantEntity[]> {
    // help_applicants에서 junior_id로 users 테이블 join
    const { data, error } = await supabase
      .from('help_applicants')
      .select('id, help_id, junior_id, is_accepted, applied_at')
      .eq('help_id', helpId);

    if (error) throw new Error(error.message);

    // 엔티티로 변환
    return (data ?? []).map((row: any) => new HelpApplicantEntity(
      row.id,
      row.help_id,
      row.junior_id,
      row.is_accepted,
      new Date(row.applied_at)
    ));
  }
} 