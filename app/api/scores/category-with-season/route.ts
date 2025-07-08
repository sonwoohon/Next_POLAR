import { GetUserScoresUseCase } from '@/backend/juniors/scores/applications/usecases/ScoreUseCases';
import { ScoreRepository } from '@/backend/juniors/scores/infrastructures/ScoreRepository';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const season = Number(req.nextUrl.searchParams.get('season'));
  const categoryId = Number(req.nextUrl.searchParams.get('categoryId'));
  const scoreUseCase = new GetUserScoresUseCase(new ScoreRepository());
  const scores = await scoreUseCase.executeByCategoryIdAndSeason(
    categoryId,
    season
  );

  return NextResponse.json(scores);
}
