import { JuniorHelp } from '../entities/JuniorHelp';

export interface IJuniorHelpStatusRepository {
  // 상태 관리
  getVerificationCode(helpId: number): Promise<JuniorHelp>;
  deleteVerificationCode(helpId: number): Promise<boolean>;
}
