export interface Applicant {
  id: number;
  helpId: number;
  juniorNickname: string;
  isAccepted: boolean;
  appliedAt: string;
}

export interface ApplicantItemProps {
  applicant: Applicant;
  onAccept: (params: { helpId: number; juniorNickname: string }) => void;
  isAccepting: boolean;
}
