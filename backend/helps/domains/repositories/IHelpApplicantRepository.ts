export interface IHelpApplicantRepository {
  getApplicantsByHelpId(helpId: number): Promise<{ nickname: string }[]>;
} 