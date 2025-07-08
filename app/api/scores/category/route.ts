import { GetUserScoresUseCase } from '@/backend/juniors/scores/applications/usecases/ScoreUseCases';
import { ScoreRepository } from '@/backend/juniors/scores/infrastructures/ScoreRepository';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const categoryIdParam = req.nextUrl.searchParams.get('categoryId');

  if (!categoryIdParam) {
    return NextResponse.json(
      { error: 'categoryId가 필요합니다.' },
      { status: 400 }
    );
  }

  const categoryId = Number(categoryIdParam);

  if (isNaN(categoryId)) {
    return NextResponse.json(
      { error: '유효하지 않은 categoryId입니다.' },
      { status: 400 }
    );
  }

  try {
    const scoreUseCase = new GetUserScoresUseCase(new ScoreRepository());
    const scores = await scoreUseCase.executeByCategoryId(categoryId);
    return NextResponse.json(scores);
  } catch (error) {
    console.error('점수 조회 중 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
