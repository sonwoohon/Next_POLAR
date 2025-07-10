export interface JuniorHelpApplyRequestDto {
  id: number;
  helpId: number;
  juniorId: number;
  isAccepted: boolean;
  // appliedAt: Date; //now로 할거임.
}