export interface IJuniorHelpStatusRepository {
  // 상태 관리
  getVerificationCode(
    helpId: number
  ): Promise<{ code: number; expires_at: number }>;
  deleteVerificationCode(helpId: number): Promise<boolean>;
}
