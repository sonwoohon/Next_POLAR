import { CommonHelpEntity } from '@/backend/helps/domains/entities/CommonHelpEntity';
import { ICommonHelpRepository } from '@/backend/helps/domains/repositories/ICommonHelpRepository';
import {
  HelpListResponseDto,
  HelpDetailResponseDto,
} from '@/backend/helps/applications/dtos/HelpDTO';
import { getNicknameByUuid } from '@/lib/getUserName';

// 헬프 리스트 조회 UseCase (닉네임 기반)
export class GetHelpListUseCase {
  constructor(private readonly helpRepository: ICommonHelpRepository) {}

  async execute(): Promise<HelpListResponseDto[] | null> {
    const helpList: CommonHelpEntity[] | null =
      await this.helpRepository.getHelpList();

    if (helpList) {
      // 각 헬프의 seniorId를 닉네임으로 변환
      const helpListWithNicknames = await Promise.all(
        helpList.map(async (help) => {
          const seniorNickname = await getNicknameByUuid(help.seniorId);
          return {
            id: help.id,
            seniorInfo: {
              nickname: seniorNickname || '알 수 없음',
            },
            title: help.title,
            startDate: help.startDate,
            endDate: help.endDate,
            category: help.category,
            content: help.content,
            status: help.status,
            createdAt: help.createdAt,
          };
        })
      );
      return helpListWithNicknames;
    }
    return null;
  }
}

// 헬프 상세 조회 UseCase (닉네임 기반)
export class GetHelpDetailUseCase {
  constructor(private readonly helpRepository: ICommonHelpRepository) {}

  async execute(id: number): Promise<HelpDetailResponseDto | null> {
    const help: CommonHelpEntity | null = await this.helpRepository.getHelpById(
      id
    );

    if (help) {
      const seniorNickname = await getNicknameByUuid(help.seniorId);
      return {
        id: help.id,
        seniorNickname: seniorNickname || '알 수 없음',
        title: help.title,
        startDate: help.startDate,
        endDate: help.endDate,
        category: help.category,
        content: help.content,
        status: help.status,
        createdAt: help.createdAt,
      };
    }
    return null;
  }
}
