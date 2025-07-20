// 헬프 지원 요청 DTO
export interface ApplyHelpRequestDto {
  helpId: number;
  juniorNickname: string;
}

// 헬프 지원 응답 DTO
export interface ApplyHelpResponseDto {
  success: boolean;
  message: string;
  error?: string;
}

// 헬프 지원자 수락 요청 DTO
export interface AcceptHelpApplicantRequestDto {
  helpId: number;
  juniorNickname: string;
}

// 헬프 지원자 수락 응답 DTO
export interface AcceptHelpApplicantResponseDto {
  success: boolean;
  message: string;
  error?: string;
}

// 헬프 지원 상태 확인 응답 DTO
export interface ApplicationStatusResponseDto {
  hasApplied: boolean;
  isAccepted: boolean;
  appliedAt?: string;
} 