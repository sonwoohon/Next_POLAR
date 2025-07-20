import { HelpApplicantEntity } from '../entities/HelpApplicant';

export interface IHelpApplicantRepository {
  getApplicantsByHelpId(helpId: number): Promise<HelpApplicantEntity[]>;
} 