import { GetUserScoresUseCase } from '@/backend/juniors/scores/applications/usecases/ScoreUseCases';
import { ScoreRepository } from '@/backend/juniors/scores/infrastructures/repositories/ScoreRepository';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const seasonParam = req.nextUrl.searchParams.get('season');
  const categoryIdParam = req.nextUrl.searchParams.get('categoryId');

  if (!seasonParam || !categoryIdParam) {
    return NextResponse.json(
      { error: 'season과 categoryId가 필요합니다.' },
      { status: 400 }
    );
  }

  const season = Number(seasonParam);
  const categoryId = Number(categoryIdParam);

  if (isNaN(season) || isNaN(categoryId)) {
    return NextResponse.json(
      { error: '유효하지 않은 매개변수입니다.' },
      { status: 400 }
    );
  }

  try {
    const scoreUseCase = new GetUserScoresUseCase(new ScoreRepository());
    const scores = await scoreUseCase.executeByCategoryIdAndSeason(
      categoryId,
      season
    );
    return NextResponse.json(scores, { status: 200 });
  } catch (error) {
    console.error('점수 조회 중 오류:', error);
    return NextResponse.json(
      { error: '점수 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
