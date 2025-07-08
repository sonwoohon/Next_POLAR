import { GetUserScoresUseCase } from '@/backend/juniors/scores/applications/usecases/ScoreUseCases';
import { ScoreRepository } from '@/backend/juniors/scores/infrastructures/ScoreRepository';
import { getAuthenticatedUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const authResult = getAuthenticatedUser(req);
  const userId = authResult.user?.id as number;
  const scoreUseCase = new GetUserScoresUseCase(new ScoreRepository());
  const scores = await scoreUseCase.executeByUserId(2);

  return NextResponse.json(scores);
}
