// 회원탈퇴 요청 DTO
export interface WithdrawalRequestDto {
  userId: number;
  reason?: string;
  confirmPassword: string;
} 