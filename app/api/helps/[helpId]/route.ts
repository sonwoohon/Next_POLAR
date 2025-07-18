import { NextRequest, NextResponse } from 'next/server';
import { SbCommonHelpRepository } from '@/backend/helps/infrastructures/repositories/SbCommonHelpRepository';
import { GetHelpDetailUseCase } from '@/backend/helps/applications/usecases/CommonHelpUseCases';
import { HelpDetailResponseDto } from '@/backend/helps/applications/dtos/HelpDTO';

const createHelpDetailUseCase = () => {
  const repository = new SbCommonHelpRepository();
  return new GetHelpDetailUseCase(repository);
};

// 헬프 상세 조회 API (helpId 기반 응답)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ helpId: string }> }
): Promise<NextResponse<HelpDetailResponseDto | null>> {
  console.log('[API] GET /api/helps/[helpId] 호출됨');
  const { helpId } = await params;
  const helpIdNumber: number = parseInt(helpId);

  try {
    const useCase = createHelpDetailUseCase();
    const helpDetail: HelpDetailResponseDto | null = await useCase.execute(helpIdNumber);

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