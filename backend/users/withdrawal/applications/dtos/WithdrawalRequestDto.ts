// 회원 탈퇴 요청 DTO
export interface WithdrawalRequestDto {
  userId: number;           // 탈퇴할 사용자 ID
  confirmPassword: string;  // 비밀번호 확인
  reason?: string;          // 탈퇴 사유 (선택사항)
}

// 회원 탈퇴 응답 DTO
export interface WithdrawalResponseDto {
  success: boolean;         // 탈퇴 성공 여부
  message: string;          // 응답 메시지
  userId?: number;          // 탈퇴된 사용자 ID
}
