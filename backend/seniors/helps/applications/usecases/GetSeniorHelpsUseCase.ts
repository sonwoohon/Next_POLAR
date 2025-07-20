import { ISeniorHelpRepositoryInterface } from '@/backend/seniors/helps/domains/repositories/SeniorHelpRepositoryInterface';
import { CommonHelpEntity } from '@/backend/helps/domains/entities/CommonHelpEntity';

export class GetSeniorHelpsUseCase {
  constructor(private seniorHelpRepository: ISeniorHelpRepositoryInterface) {}

  async execute(seniorNickname: string): Promise<CommonHelpEntity[] | null> {
    if (!seniorNickname) {
      throw new Error('시니어 닉네임이 필요합니다.');
    }

    return await this.seniorHelpRepository.getHelpsBySeniorNickname(seniorNickname);
  }
} 