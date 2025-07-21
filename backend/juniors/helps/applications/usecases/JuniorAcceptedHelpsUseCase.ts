// 주니어가 수락된 Help 리스트 조회 유스케이스
import { IJuniorHelpStatusRepository } from '@/backend/juniors/helps/domains/repositories/IJuniorHelpStatusRepository';
import { HelpListResponseDto } from '@/backend/helps/applications/dtos/HelpDTO';

export class JuniorAcceptedHelpsUseCase {
  constructor(
    private juniorHelpStatusRepository: IJuniorHelpStatusRepository
  ) {}

  async getAcceptedHelps(request: {
    juniorNickname: string;
    page: number;
    limit: number;
  }): Promise<{
    helps: HelpListResponseDto[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }> {
    const { juniorNickname, page = 1, limit = 10 } = request;

    // 페이지네이션 유효성 검사
    const validPage = Math.max(1, page);
    const validLimit = Math.min(100, Math.max(1, limit));

    // 주니어가 수락된 Help 리스트 조회
    const result =
      await this.juniorHelpStatusRepository.getAcceptedHelpsByJuniorId(
        juniorNickname,
        validPage,
        validLimit
      );

    // 총 페이지 수 계산
    const totalPages = Math.ceil(result.totalCount / validLimit);

    return {
      helps: result.helps,
      totalCount: result.totalCount,
      currentPage: validPage,
      totalPages,
    };
  }
}
