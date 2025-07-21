import { NextRequest, NextResponse } from 'next/server';
import { JuniorAcceptedHelpsUseCase } from '@/backend/juniors/helps/applications/usecases/JuniorAcceptedHelpsUseCase';
import { JuniorHelpStatusInfrastructure } from '@/backend/juniors/helps/infrastructures/repositories/JuniorHelpStatusInfrastructure';

const juniorAcceptedHelpsUseCase = new JuniorAcceptedHelpsUseCase(
  new JuniorHelpStatusInfrastructure()
);

// GET /api/juniors/helps/accepted
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const juniorNickname = searchParams.get('juniorNickname');
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');

    if (!juniorNickname) {
      return NextResponse.json(
        { error: 'juniorNickname이 필요합니다.' },
        { status: 400 }
      );
    }

    const result = await juniorAcceptedHelpsUseCase.getAcceptedHelps({
      juniorNickname,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('주니어 수락 Help 조회 중 오류:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : '주니어 수락 Help 조회 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
