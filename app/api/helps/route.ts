import { NextResponse } from 'next/server';

import { GetHelpListUseCase } from '@/backend/helps/applications/usecases/CommonHelpUseCases';
import { SbCommonHelpRepository } from '@/backend/helps/infrastructures/repositories/SbCommonHelpRepository';
import { HelpListResponseDto } from '@/backend/helps/applications/dtos/HelpDTO';

// 의존성 주입을 위한 UseCase 인스턴스 생성
const createHelpListUseCase = () => {
  const repository = new SbCommonHelpRepository();
  return new GetHelpListUseCase(repository);
};

// 헬프 리스트 조회 API (닉네임 기반 응답)
export async function GET(): Promise<
  NextResponse<HelpListResponseDto[] | null>
> {
  console.log('[API] GET /api/helps 호출됨');

  try {
    const useCase = createHelpListUseCase();
    const helpList: HelpListResponseDto[] | null = await useCase.execute();

    if (helpList) {
      return NextResponse.json(helpList, { status: 200 });
    }

    return NextResponse.json(null, { status: 404 });
  } catch (error) {
    console.error('[API] 헬프 리스트 조회 오류:', error);
    return NextResponse.json(null, { status: 500 });
  }
}
