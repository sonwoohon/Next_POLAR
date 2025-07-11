import { supabase } from '@/backend/common/utils/supabaseClient';
import { ISeniorHelpStatusRepository } from '@/backend/seniors/helps/domains/repositories/SeniorHelpRepositoryInterface';

export async function createVerificationCode(
  helpId: number,
  code: number,
  expiresAt: number
) {
  const { error } = await supabase
    .from('help_verification_codes')
    .upsert([{ help_id: helpId, code, expires_at: expiresAt }]);

  if (error) {
    console.error('인증 코드 생성 오류:', error);
    throw new Error('인증 코드 생성에 실패했습니다.');
  }
}

export class SeniorHelpStatusInfrastructure
  implements ISeniorHelpStatusRepository
{
  async createVerificationCode(
    helpId: number,
    code: number,
    expiresAt: number
  ) {
    const { error } = await supabase
      .from('help_verification_codes')
      .upsert([{ help_id: helpId, code, expires_at: expiresAt }]);

    if (error) {
      console.error('인증 코드 생성 오류:', error);
      throw new Error('인증 코드 생성에 실패했습니다.');
    }
  }
}
