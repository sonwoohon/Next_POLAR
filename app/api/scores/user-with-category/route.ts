import { GetUserScoresUseCase } from '@/backend/juniors/scores/applications/usecases/ScoreUseCases';
import { ScoreRepository } from '@/backend/juniors/scores/infrastructures/repositories/ScoreRepository';
import { getAuthenticatedUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const authResult = getAuthenticatedUser(req);
  const userId = authResult.user?.id as number;
  const categoryId = Number(req.nextUrl.searchParams.get('categoryId'));

  if (!categoryId) {
    return NextResponse.json(
      { error: 'categoryId가 필요합니다.' },
      { status: 400 }
    );
  }

  if (isNaN(categoryId)) {
    return NextResponse.json(
      { error: '유효하지 않은 categoryId입니다.' },
      { status: 400 }
    );
  }

  try {
    const scoreUseCase = new GetUserScoresUseCase(new ScoreRepository());
    const scores = await scoreUseCase.executeByUserIdAndCategoryId({
      userId,
      categoryId,
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
