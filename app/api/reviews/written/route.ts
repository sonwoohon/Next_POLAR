import { NextRequest, NextResponse } from 'next/server';
import { ReviewUseCases } from '@/backend/reviews/applications/usecases/ReviewUseCases';
import { SbReviewRepository } from '@/backend/reviews/infrastructures/repositories/SbReviewRepository';

const reviewUseCases = new ReviewUseCases(new SbReviewRepository());

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const nickname = searchParams.get('nickname');
  if (!nickname) {
    return NextResponse.json({ error: 'nickname 쿼리 파라미터가 필요합니다.' }, { status: 400 });
  }
  
  try {
    const reviews = await reviewUseCases.getReviewsByWriterNickname(nickname);
    return NextResponse.json({ success: true, reviews }, { status: 200 });
  } catch (error) {
    console.error('리뷰 조회 중 오류:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : '리뷰 조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
} 