export class HelpApplicantEntity {
  constructor(
    public id: number,
    public helpId: number,
    public juniorId: string,
    public isAccepted: boolean,
    public appliedAt: Date
  ) {}

  toJSON() {
    return {
      id: this.id,
      helpId: this.helpId,
      juniorId: this.juniorId,
      isAccepted: this.isAccepted,
      appliedAt: this.appliedAt,
    };
  }
} 