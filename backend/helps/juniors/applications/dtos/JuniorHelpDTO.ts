export interface JuniorHelpApplyRequestDto {
  id: number;
  helpId: number;
  juniorId: string; // UUID로 변경
  isAccepted: boolean;
  // appliedAt: Date; //now로 할거임.
}
