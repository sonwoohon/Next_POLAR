import { HelpStatus } from '@/backend/helps/domains/entities/HelpStatus';

// Help 상태 관리 리포지토리 인터페이스 (공통)
export interface IHelpStatusRepository {
  // 상태 관리
  updateHelpStatus(helpId: number, status: HelpStatus): Promise<boolean>;
  getHelpStatus(helpId: number): Promise<HelpStatus | null>;
}
