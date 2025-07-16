import { CommonHelpEntity } from '@/backend/helps/domains/entities/CommonHelpEntity';
import { IJuniorHelpRepository } from '@/backend/helps/juniors/domains/repositories/IJuniorHelpRepository';
import { getUuidByNickname } from '@/lib/getUserName';

// 지원한 헬프 리스트 조회 (닉네임 기반)
export class GetJuniorAppliedHelpListUseCase {
  constructor(private readonly juniorHelpRepository: IJuniorHelpRepository) {}

  async execute(juniorNickname: string): Promise<CommonHelpEntity[] | null> {
    // 닉네임을 UUID로 변환
    const juniorId = await getUuidByNickname(juniorNickname);
    if (!juniorId) {
      throw new Error(`사용자를 찾을 수 없습니다: ${juniorNickname}`);
    }

    const helpList: CommonHelpEntity[] | null =
      await this.juniorHelpRepository.getJuniorAppliedHelpList(juniorId);

    if (helpList) {
      return helpList;
    }
    return null;
  }
}

// 헬프 지원 (닉네임 기반)
export class ApplyHelpUseCase {
  constructor(private readonly juniorHelpRepository: IJuniorHelpRepository) {}

  async execute(juniorNickname: string, helpId: number): Promise<void | null> {
    // 닉네임을 UUID로 변환
    const juniorId = await getUuidByNickname(juniorNickname);
    if (!juniorId) {
      throw new Error(`사용자를 찾을 수 없습니다: ${juniorNickname}`);
    }

    return await this.juniorHelpRepository.applyHelp(juniorId, helpId);
  }
}

// 헬프 지원 취소 (닉네임 기반)
export class CancelJuniorHelpUseCase {
  constructor(private readonly juniorHelpRepository: IJuniorHelpRepository) {}

  async execute(juniorNickname: string, helpId: number): Promise<void | null> {
    // 닉네임을 UUID로 변환
    const juniorId = await getUuidByNickname(juniorNickname);
    if (!juniorId) {
      throw new Error(`사용자를 찾을 수 없습니다: ${juniorNickname}`);
    }

    return await this.juniorHelpRepository.cancelJuniorlHelp(juniorId, helpId);
  }
}
