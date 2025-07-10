// 주니어 Help 완료 처리 유스케이스
<<<<<<< HEAD
import { IHelpStatusRepository } from '@/backend/helps/domains/repositories/IHelpStatusRepository';
import { HelpStatus } from '@/backend/helps/domains/entities/HelpStatus';
import { IJuniorHelpStatusRepository } from '@/backend/juniors/helps/domains/repositories/IJuniorHelpStatusRepository';
=======
import { IHelpStatusRepository } from '@/backend/common/repositories/IHelpStatusRepository';
import { HelpStatus } from '@/backend/common/entities/HelpStatus';
import { IJuniorHelpStatusRepository } from '../../domains/repositories/IJuniorHelpStatusRepository';
>>>>>>> 714e74345bf047750ce28a37052b6141b2547621

export class JuniorHelpCompletionUseCase {
  constructor(
    private helpStatusRepository: IHelpStatusRepository,
    private juniorHelpStatusRepository: IJuniorHelpStatusRepository
  ) {}

  // 주니어: 인증 코드 입력 및 완료 처리 (CONNECTING -> COMPLETED)
  async completeHelp(helpId: number, inputCode: number): Promise<boolean> {
    const currentStatus = await this.helpStatusRepository.getHelpStatus(helpId);
    if (!currentStatus) {
      throw new Error('Help를 찾을 수 없습니다.');
    }

    // DB에서 인증 코드 조회 (트리거로 만료된 코드는 자동 삭제됨)
    const storedVerification =
      await this.juniorHelpStatusRepository.getVerificationCode(helpId);
    if (!storedVerification) {
      throw new Error('인증 코드가 만료되었거나 존재하지 않습니다.');
    }

    console.log('storedVerification', storedVerification, inputCode);

    // 코드 일치 여부 확인
    if (storedVerification.code !== inputCode) {
      throw new Error('유효하지 않은 인증 코드입니다.');
    }

    // 만료 시간 확인 (UNIX 타임스탬프 비교)
    const currentTime = Date.now();
    const expiryTime = Number(storedVerification.expires_at);

    if (currentTime > expiryTime) {
      throw new Error('인증 코드가 만료되었습니다.');
    }

    // 인증 성공 시 DB에서 코드 삭제 (1회성 인증)
    await this.juniorHelpStatusRepository.deleteVerificationCode(helpId);

    // 상태를 COMPLETED로 변경
    return await this.helpStatusRepository.updateHelpStatus(
      helpId,
      HelpStatus.COMPLETED
    );
  }

  // 주니어: 인증 코드 유효성 미리 확인 (UI에서 사용)
  async validateCode(helpId: number, inputCode: number): Promise<boolean> {
    const storedVerification =
      await this.juniorHelpStatusRepository.getVerificationCode(helpId);
    if (!storedVerification) {
      return false;
    }

    // 코드 일치 및 만료 시간 확인
    return (
      storedVerification.code === inputCode &&
      new Date() < new Date(storedVerification.expires_at)
    );
  }
}
