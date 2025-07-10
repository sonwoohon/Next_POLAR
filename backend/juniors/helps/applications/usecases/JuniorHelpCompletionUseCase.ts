// 주니어 Help 완료 처리 유스케이스
import { IHelpStatusRepository } from '@/backend/common/repositories/IHelpStatusRepository';
import { IJuniorHelpStatusRepository } from '../../domains/repositories/IJuniorHelpStatusRepository';
import { HelpStatus } from '@/backend/helps/domains/entities/HelpStatus';

export class JuniorHelpCompletionUseCase {
  constructor(
    private helpStatusRepository: IHelpStatusRepository,
    private juniorHelpStatusRepository: IJuniorHelpStatusRepository
  ) {}

  async completeHelp(helpId: number, inputCode: number): Promise<boolean> {
    const currentStatus = await this.helpStatusRepository.getHelpStatus(helpId);
    if (!currentStatus) {
      throw new Error('Help를 찾을 수 없습니다.');
    }

    const storedVerification =
      await this.juniorHelpStatusRepository.getVerificationCode(helpId);
    if (!storedVerification) {
      throw new Error('인증 코드가 만료되었거나 존재하지 않습니다.');
    }

    if (storedVerification.code !== inputCode) {
      throw new Error('유효하지 않은 인증 코드입니다.');
    }

    const currentTime = Date.now();
    const expiryTime = Number(storedVerification.expiresAt);

    if (currentTime > expiryTime) {
      throw new Error('인증 코드가 만료되었습니다.');
    }

    await this.juniorHelpStatusRepository.deleteVerificationCode(helpId);

    return await this.helpStatusRepository.updateHelpStatus(
      helpId,
      HelpStatus.COMPLETED
    );
  }

  async validateCode(helpId: number, inputCode: number): Promise<boolean> {
    const storedVerification =
      await this.juniorHelpStatusRepository.getVerificationCode(helpId);
    if (!storedVerification) {
      return false;
    }

    // 코드 일치 및 만료 시간 확인
    return (
      storedVerification.code === inputCode &&
      new Date() < new Date(storedVerification.expiresAt)
    );
  }
}
