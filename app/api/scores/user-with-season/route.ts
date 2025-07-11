import { GetUserScoresUseCase } from '@/backend/juniors/scores/applications/usecases/ScoreUseCases';
import { ScoreRepository } from '@/backend/juniors/scores/infrastructures/repositories/ScoreRepository';
import { getAuthenticatedUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const authResult = getAuthenticatedUser(req);
  const userId = authResult.user?.id as number;
  const season = Number(req.nextUrl.searchParams.get('season'));

  if (!season) {
    return NextResponse.json(
      { error: 'season이 필요합니다.' },
      { status: 400 }
    );
  }

  if (isNaN(season)) {
    return NextResponse.json(
      { error: '유효하지 않은 season입니다.' },
      { status: 400 }
    );
  }

  try {
    const scoreUseCase = new GetUserScoresUseCase(new ScoreRepository());
    const scores = await scoreUseCase.executeByUserIdAndSeason({
      userId,
      season,
    });
    return NextResponse.json(scores, { status: 200 });
  } catch (error) {
    console.error('점수 조회 중 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
