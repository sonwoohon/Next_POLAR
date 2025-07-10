// 공통 Help 상태 관리 유스케이스 (모든 상태 변경 지원)
import { IHelpStatusRepository } from '../../domains/repositories/IHelpStatusRepository';
import {
  HelpStatus,
  STATUS_TRANSITIONS,
} from '../../domains/entities/HelpStatus';

export class CommonHelpStatusUseCase {
  constructor(private helpStatusRepository: IHelpStatusRepository) {}

  // Help 상태 변경 (모든 상태 지원, 전이 규칙 검증)
  async updateHelpStatus(
    helpId: number,
    newStatus: HelpStatus
  ): Promise<boolean> {
    const currentStatus = await this.helpStatusRepository.getHelpStatus(helpId);
    if (!currentStatus) {
      throw new Error('Help를 찾을 수 없습니다.');
    }

    // 상태 전이 규칙 검증
    const allowedTransitions = STATUS_TRANSITIONS[currentStatus];
    if (!allowedTransitions.includes(newStatus)) {
      throw new Error(
        `${currentStatus} 상태에서 ${newStatus} 상태로 변경할 수 없습니다.`
      );
    }

    return await this.helpStatusRepository.updateHelpStatus(helpId, newStatus);
  }

  // Help 상태 조회
  async getHelpStatus(helpId: number): Promise<HelpStatus | null> {
    return await this.helpStatusRepository.getHelpStatus(helpId);
  }
}
