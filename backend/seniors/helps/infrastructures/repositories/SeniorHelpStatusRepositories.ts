import { supabase } from '@/backend/common/utils/supabaseClient';
import { ISeniorHelpStatusRepository } from '@/backend/seniors/helps/domains/repositories/SeniorHelpRepositoryInterface';

export async function createVerificationCode(
  helpId: number,
  code: number,
  expiresAt: number
) {
  console.log('🔍 createVerificationCode 호출됨:', { helpId, code, expiresAt });

  // 기존 인증번호가 있다면 먼저 삭제
  const { error: deleteError } = await supabase
    .from('help_verification_codes')
    .delete()
    .eq('help_id', helpId);

  if (deleteError) {
    console.error('기존 인증번호 삭제 오류:', deleteError);
  } else {
    console.log('✅ 기존 인증번호 삭제 완료');
  }

  // 새로운 인증번호 삽입
  const { error } = await supabase
    .from('help_verification_codes')
    .insert([{ help_id: helpId, code, expires_at: expiresAt }]);

  if (error) {
    console.error('인증 코드 생성 오류:', error);
    throw new Error('인증 코드 생성에 실패했습니다.');
  }

  console.log('✅ 인증 코드 생성 성공:', { helpId, code });
}

export class SeniorHelpStatusInfrastructure
  implements ISeniorHelpStatusRepository
{
  async createVerificationCode(
    helpId: number,
    code: number,
    expiresAt: number
  ) {
    console.log(
      '🔍 SeniorHelpStatusInfrastructure.createVerificationCode 호출됨:',
      { helpId, code, expiresAt }
    );

    // 기존 인증번호가 있다면 먼저 삭제
    const { error: deleteError } = await supabase
      .from('help_verification_codes')
      .delete()
      .eq('help_id', helpId);

    if (deleteError) {
      console.error('기존 인증번호 삭제 오류:', deleteError);
    } else {
      console.log('✅ 기존 인증번호 삭제 완료');
    }

    // 새로운 인증번호 삽입
    const { error } = await supabase
      .from('help_verification_codes')
      .insert([{ help_id: helpId, code, expires_at: expiresAt }]);

    if (error) {
      console.error('인증 코드 생성 오류:', error);
      throw new Error('인증 코드 생성에 실패했습니다.');
    }

    console.log('✅ 인증 코드 생성 성공:', { helpId, code });
  }
}
