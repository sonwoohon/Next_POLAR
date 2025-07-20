import { HelpApplicantEntity } from '../entities/HelpApplicant';

export interface IHelpApplicantRepository {
  getApplicantsByHelpId(helpId: number): Promise<HelpApplicantEntity[]>;
  createHelpApplication(applicant: HelpApplicantEntity): Promise<HelpApplicantEntity>;
  acceptHelpApplicant(applicant: HelpApplicantEntity): Promise<HelpApplicantEntity>;
  checkDuplicateApplication(helpId: number, juniorId: string): Promise<boolean>;
} 