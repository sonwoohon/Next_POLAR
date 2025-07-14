export class JuniorHelpEntity {
  constructor(
    public id: number,
    public helpId: number,
    public juniorId: string, // UUID로 변경
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
