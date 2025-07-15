import { IHelpApplicantRepository } from '@/backend/helps/domains/repositories/IHelpApplicantRepository';

export class GetHelpApplicantsUseCase {
  constructor(private readonly applicantRepo: IHelpApplicantRepository) {}

  async execute(helpId: number): Promise<{ nicknames: string[] }> {
    const applicants = await this.applicantRepo.getApplicantsByHelpId(helpId);
    return { nicknames: applicants.map(a => a.nickname) };
  }
} 