// Help 상태 관리 요청 DTO (공통)
export interface SelectJuniorRequestDto {
  helpId: number;
  juniorId: number;
}

export interface RequestCompletionRequestDto {
  helpId: number;
}

export interface CompleteHelpRequestDto {
  helpId: number;
  verificationCode: string;
}
