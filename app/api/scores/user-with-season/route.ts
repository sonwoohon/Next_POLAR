import { GetUserScoresUseCase } from '@/backend/juniors/scores/applications/usecases/ScoreUseCases';
import { ScoreRepository } from '@/backend/juniors/scores/infrastructures/ScoreRepository';
import { getAuthenticatedUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const authResult = getAuthenticatedUser(req);
  const userId = authResult.user?.id as number;
  const season = Number(req.nextUrl.searchParams.get('season'));
  const scoreUseCase = new GetUserScoresUseCase(new ScoreRepository());
  const scores = await scoreUseCase.executeByUserIdAndSeason(2, season);

  return NextResponse.json(scores);
}
