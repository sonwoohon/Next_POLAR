// 회원탈퇴 응답 DTO
export interface WithdrawalResponseDto {
  success: boolean;
  message: string;
  withdrawalDate: Date;
  userId: number;
} 