// 공통 Help 상태 관리 유스케이스 (기본 상태 관리만)
import { IHelpStatusRepository } from '../../domains/repositories/IHelpStatusRepository';
import { HelpStatus } from '../../domains/entities/HelpStatus';

export class CommonHelpStatusUseCase {
  constructor(private helpStatusRepository: IHelpStatusRepository) {}

  // Help 닫기 (OPEN -> CLOSE) - 수동으로만 가능
  async closeHelp(helpId: number): Promise<boolean> {
    const currentStatus = await this.helpStatusRepository.getHelpStatus(helpId);
    if (!currentStatus) {
      throw new Error('Help를 찾을 수 없습니다.');
    }

    // OPEN 상태에서만 닫을 수 있음
    if (currentStatus !== HelpStatus.OPEN) {
      throw new Error('OPEN 상태에서만 닫을 수 있습니다.');
    }

    return await this.helpStatusRepository.updateHelpStatus(
      helpId,
      HelpStatus.CLOSE
    );
  }

  // Help 상태 조회
  async getHelpStatus(helpId: number): Promise<HelpStatus | null> {
    return await this.helpStatusRepository.getHelpStatus(helpId);
  }
}
