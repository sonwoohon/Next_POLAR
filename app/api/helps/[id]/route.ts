import { NextRequest, NextResponse } from 'next/server';
import { SbCommonHelpRepository } from '@/backend/helps/infrastructures/repositories/SbCommonHelpRepository';
import { GetHelpDetailUseCase } from '@/backend/helps/applications/usecases/CommonHelpUseCases';
import { HelpDetailResponseDto } from '@/backend/helps/applications/dtos/HelpDTO';

const createHelpDetailUseCase = () => {
  const repository = new SbCommonHelpRepository();
  return new GetHelpDetailUseCase(repository);
};

export async function GET(
  request: NextRequest
): Promise<NextResponse<HelpDetailResponseDto | null>> {
  console.log('[API] GET /api/helps/:id 호출됨');
  const id: number = parseInt(request.nextUrl.pathname.split('/').pop() || '0');

  try {
    const useCase = createHelpDetailUseCase();
    const helpDetail: HelpDetailResponseDto | null = await useCase.execute(id);

    if (helpDetail) {
      console.log('[API] 헬프 상세 조회 성공:', helpDetail);
      return NextResponse.json(helpDetail, { status: 200 });
    }

    return NextResponse.json(null, { status: 404 });
  } catch (error) {
    console.error('[API] 헬프 상세 조회 오류:', error);
    return NextResponse.json(null, { status: 500 });
  }
}
