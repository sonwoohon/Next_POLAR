// Help 상태 관리 응답 DTO (공통)
export interface StatusUpdateResponseDto {
  success: boolean;
  message: string;
}

export interface VerificationCodeResponseDto {
  verificationCode: string;
  message: string;
}

export interface HelpStatusResponseDto {
  helpId: number;
  status: string;
  selectedJuniorId?: number;
}
