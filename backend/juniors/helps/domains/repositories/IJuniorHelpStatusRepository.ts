import { JuniorHelpVerificationCodeEntity } from '@/backend/juniors/helps/domains/entities/JuniorHelp';

export interface IJuniorHelpStatusRepository {
  // 상태 관리
  getVerificationCode(
    helpId: number
  ): Promise<JuniorHelpVerificationCodeEntity>;
  deleteVerificationCode(helpId: number): Promise<boolean>;
}
