import { GetUserScoresUseCase } from '@/backend/juniors/scores/applications/usecases/ScoreUseCases';
import { ScoreRepository } from '@/backend/juniors/scores/infrastructures/ScoreRepository';
import { getAuthenticatedUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const authResult = getAuthenticatedUser(req);
  const userIdParam = authResult.user?.id as number;

  if (!userIdParam) {
    return NextResponse.json(
      { error: 'userId가 필요합니다.' },
      { status: 400 }
    );
  }

  const userId = Number(userIdParam);

  if (isNaN(userId)) {
    return NextResponse.json(
      { error: '유효하지 않은 userId입니다.' },
      { status: 400 }
    );
  }

  try {
    const scoreUseCase = new GetUserScoresUseCase(new ScoreRepository());
    const scores = await scoreUseCase.executeByUserId(2);
    return NextResponse.json(scores);
  } catch (error) {
    console.error('점수 조회 중 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
