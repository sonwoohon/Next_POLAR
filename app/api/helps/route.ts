import { NextRequest, NextResponse } from 'next/server';

import {
  GetHelpListUseCase,
  GetHelpListWithPaginationUseCase,
} from '@/backend/helps/applications/usecases/CommonHelpUseCases';
import { SbCommonHelpRepository } from '@/backend/helps/infrastructures/repositories/SbCommonHelpRepository';
import { HelpListResponseDto } from '@/backend/helps/applications/dtos/HelpDTO';
import { HelpFilterDto } from '@/backend/helps/applications/dtos/HelpFilterDto';
import { HelpPaginationResponseDto } from '@/backend/helps/applications/dtos/HelpPaginationDto';

// 의존성 주입을 위한 UseCase 인스턴스 생성
const createHelpListUseCase = () => {
  const repository = new SbCommonHelpRepository();
  return new GetHelpListUseCase(repository);
};

// 헬프 리스트 조회 API (닉네임 기반 응답)
export async function GET(
  request: NextRequest
): Promise<
  NextResponse<HelpListResponseDto[] | HelpPaginationResponseDto | null>
> {
  console.log('[API] GET /api/helps 호출됨');

  try {
    // 쿼리 파라미터 파싱
    const { searchParams } = new URL(request.url);
    const filter: HelpFilterDto = {};

    // 메인 카테고리 ID 필터 (categories 테이블)
    const categoryIdsParam = searchParams.get('categoryIds');
    if (categoryIdsParam) {
      filter.categoryIds = categoryIdsParam
        .split(',')
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id));
    }

    // 서브 카테고리 ID 필터 (sub_categories 테이블)
    const subCategoryIdsParam = searchParams.get('subCategoryIds');
    if (subCategoryIdsParam) {
      filter.subCategoryIds = subCategoryIdsParam
        .split(',')
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id));
    }

    // 날짜 필터
    const startDate = searchParams.get('startDate');
    if (startDate) {
      filter.startDate = startDate;
    }

    const endDate = searchParams.get('endDate');
    if (endDate) {
      filter.endDate = endDate;
    }

    // 상태 필터
    const status = searchParams.get('status');
    if (status) {
      filter.status = status;
    }

    // 페이지네이션 파라미터
    const pageParam = searchParams.get('page');
    if (pageParam) {
      const page = parseInt(pageParam);
      if (!isNaN(page)) {
        filter.page = page;
      }
    }

    const limitParam = searchParams.get('limit');
    if (limitParam) {
      const limit = parseInt(limitParam);
      if (!isNaN(limit)) {
        filter.limit = limit;
      }
    }

    const offsetParam = searchParams.get('offset');
    if (offsetParam) {
      const offset = parseInt(offsetParam);
      if (!isNaN(offset)) {
        filter.offset = offset;
      }
    }

    // 페이지네이션 모드 확인
    const usePagination =
      searchParams.get('pagination') === 'true' || filter.page !== undefined;

    console.log('[API] 필터 파라미터:', filter, '페이지네이션:', usePagination);

    if (usePagination) {
      // 페이지네이션 모드
      const paginationUseCase = new GetHelpListWithPaginationUseCase(
        new SbCommonHelpRepository()
      );
      const result: HelpPaginationResponseDto | null =
        await paginationUseCase.execute(filter);

      if (result) {
        return NextResponse.json(result, { status: 200 });
      }
    } else {
      // 기존 모드 (페이지네이션 없음)
      const useCase = createHelpListUseCase();
      const helpList: HelpListResponseDto[] | null = await useCase.execute(
        filter
      );

      if (helpList) {
        return NextResponse.json(helpList, { status: 200 });
      }
    }

    return NextResponse.json(null, { status: 404 });
  } catch (error) {
    console.error('[API] 헬프 리스트 조회 오류:', error);
    return NextResponse.json(null, { status: 500 });
  }
}
