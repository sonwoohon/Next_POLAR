import { IHelpApplicantRepository } from '@/backend/helps/domains/repositories/IHelpApplicantRepository';
import { HelpApplicantEntity } from '@/backend/helps/domains/entities/HelpApplicant';

export class GetHelpApplicantsUseCase {
  constructor(private readonly applicantRepo: IHelpApplicantRepository) {}

  async execute(helpId: number): Promise<HelpApplicantEntity[]> {
    const applicants = await this.applicantRepo.getApplicantsByHelpId(helpId);
    return applicants;
  }
} 