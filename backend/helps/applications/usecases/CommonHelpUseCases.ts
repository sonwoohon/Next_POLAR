import { CommonHelpEntity } from "../../domains/entities/CommonHelpEntity";
import { ICommonHelpRepository } from "../../domains/repositories/ICommonHelpRepository";
import { HelpListResponseDto, HelpDetailResponseDto } from "../dtos/HelpDTO";


// 헬프 리스트 조회 UseCase
export class GetHelpListUseCase {
  constructor(private readonly helpRepository: ICommonHelpRepository) { }

  async execute(): Promise<HelpListResponseDto[] | null> {
    const helpList: CommonHelpEntity[] | null = await this.helpRepository.getHelpList();

    if (helpList) {
      return helpList.map((help) => ({
        id: help.id,
        seniorInfo: {
          id: help.seniorId,
          // 기타 시니어 정보 필요시 추가
        },
        title: help.title,
        startDate: help.startDate,
        endDate: help.endDate,
        category: help.category,
        content: help.content,
        status: help.status,
        createdAt: help.createdAt,
      }));
    }
    return null;
  }
}

// 헬프 상세 조회 UseCase
export class GetHelpDetailUseCase {
  constructor(private readonly helpRepository: ICommonHelpRepository) { }

  async execute(id: number): Promise<HelpDetailResponseDto | null> {
    const help: CommonHelpEntity | null = await this.helpRepository.getHelpById(id);

    if (help) {
      return {
        id: help.id,
        seniorId: help.seniorId,
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