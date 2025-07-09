import { CommonHelpEntity } from "@/backend/helps/domains/entities/CommonHelpEntity";
import { IJuniorHelpRepository } from "../../domains/repositories/IJuniorHelpRepository";

// 지원한 헬프 리스트 조회
export class GetJuniorAppliedHelpListUseCase {
  constructor(private readonly juniorHelpRepository: IJuniorHelpRepository) { }

  async execute(juniorId: number): Promise<CommonHelpEntity[] | null> {
    const helpList: CommonHelpEntity[] | null = await this.juniorHelpRepository.getJuniorAppliedHelpList(juniorId);

    if (helpList) {
      return helpList;
    }
    return null;
  }
}

// 헬프 지원
export class ApplyHelpUseCase {
  constructor(private readonly juniorHelpRepository: IJuniorHelpRepository) { }

  async execute(juniorId: number, helpId: number): Promise<void | null> {
    return await this.juniorHelpRepository.applyHelp(juniorId, helpId);
  }
}

export class CancelJuniorHelpUseCase {
  constructor(private readonly juniorHelpRepository: IJuniorHelpRepository) { }

  async execute(juniorId: number, helpId: number): Promise<void | null> {
    return await this.juniorHelpRepository.cancelJuniorlHelp(juniorId, helpId);
  }
}