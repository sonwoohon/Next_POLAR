export interface HelpApplicantDto {
  id: number;
  helpId: number;
  juniorNickname: string;
  isAccepted: boolean;
  appliedAt: string;
}

export interface HelpApplicantsResponseDto {
  success: boolean;
  applicants: HelpApplicantDto[];
  error?: string;
} 