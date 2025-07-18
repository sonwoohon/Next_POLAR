import { CommonHelpEntity } from '@/backend/helps/domains/entities/CommonHelpEntity';
import { ICommonHelpRepository } from '@/backend/helps/domains/repositories/ICommonHelpRepository';
import { IHelpImageRepository } from '@/backend/images/domains/repositories/IHelpImageRepository';
import {
  HelpListResponseDto,
  HelpDetailResponseDto,
} from '@/backend/helps/applications/dtos/HelpDTO';
import { HelpFilterDto } from '@/backend/helps/applications/dtos/HelpFilterDto';
import { HelpPaginationResponseDto } from '@/backend/helps/applications/dtos/HelpPaginationDto';
import { getNicknameByUuid } from '@/lib/getUserData';

// 헬프 리스트 조회 UseCase (닉네임 기반)
export class GetHelpListUseCase {
  constructor(private readonly helpRepository: ICommonHelpRepository) {}

  async execute(filter?: HelpFilterDto): Promise<HelpListResponseDto[] | null> {
    const helpList: CommonHelpEntity[] | null = filter
      ? await this.helpRepository.getHelpListWithFilter(filter)
      : await this.helpRepository.getHelpList();

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

// 헬프 상세 조회 UseCase (helpId 기반)
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

// 헬프 ID 목록으로 헬프들 조회 UseCase (채팅방용)
export class GetHelpsByIdsUseCase {
  constructor(
    private readonly helpRepository: ICommonHelpRepository,
    private readonly helpImageRepository: IHelpImageRepository
  ) {}

  async execute(helpIds: number[]): Promise<HelpDetailResponseDto[] | null> {
    if (!helpIds || helpIds.length === 0) {
      return [];
    }

    const helps: CommonHelpEntity[] = [];

    // 각 helpId로 헬프 정보 조회
    for (const helpId of helpIds) {
      const help = await this.helpRepository.getHelpById(helpId);
      if (help) {
        helps.push(help);
      }
    }

    if (helps.length === 0) {
      return [];
    }

    // 생성일 기준으로 정렬 (최신순)
    helps.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // 각 헬프의 seniorId를 닉네임으로 변환하고 이미지 정보도 가져오기
    const helpsWithNicknames = await Promise.all(
      helps.map(async (help) => {
        const seniorNickname = await getNicknameByUuid(help.seniorId);
        const images = await this.helpImageRepository.getHelpImageUrlsByHelpId(
          help.id
        );

        return {
          id: help.id,
          seniorNickname: seniorNickname || '알 수 없음',
          title: help.title,
          startDate: help.startDate,
          endDate: help.endDate,
          content: help.content,
          category: help.category,
          status: help.status,
          createdAt: help.createdAt,
          images: images,
        };
      })
    );

    return helpsWithNicknames;
  }
}

// 페이지네이션을 지원하는 헬프 리스트 조회 UseCase
export class GetHelpListWithPaginationUseCase {
  constructor(private readonly helpRepository: ICommonHelpRepository) {}

  async execute(
    filter: HelpFilterDto
  ): Promise<HelpPaginationResponseDto | null> {
    // 페이지네이션 파라미터 설정
    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const offset = (page - 1) * limit;

    // 필터에 페이지네이션 정보 추가
    const paginationFilter: HelpFilterDto = {
      ...filter,
      limit,
      offset,
    };

    // 데이터와 총 개수를 병렬로 조회
    const [helpList, totalCount] = await Promise.all([
      this.helpRepository.getHelpListWithFilter(paginationFilter),
      this.helpRepository.getHelpCountWithFilter(filter),
    ]);

    if (!helpList) {
      return null;
    }

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

    // 페이지네이션 정보 계산
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      data: helpListWithNicknames,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage,
      },
    };
  }
}
