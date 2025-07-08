import { GetUserScoresUseCase } from '@/backend/juniors/scores/applications/usecases/ScoreUseCases';
import { ScoreRepository } from '@/backend/juniors/scores/infrastructures/ScoreRepository';
import { getAuthenticatedUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const authResult = getAuthenticatedUser(req);
  const userId = authResult.user?.id as number;
  const categoryId = Number(req.nextUrl.searchParams.get('categoryId'));
  const scoreUseCase = new GetUserScoresUseCase(new ScoreRepository());
  const scores = await scoreUseCase.executeByUserIdAndCategoryId(2, categoryId);

  return NextResponse.json(scores);
}
