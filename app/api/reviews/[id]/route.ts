import { NextRequest, NextResponse } from 'next/server';
import { ReviewUseCases } from '@/backend/reviews/applications/usecases/ReviewUseCases';
import { SbReviewRepository } from '@/backend/reviews/infrastructures/SbReviewRepository';

const reviewUseCases = new ReviewUseCases(new SbReviewRepository());

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reviewId = Number(params.id);
    if (isNaN(reviewId)) {
      return NextResponse.json({ error: '잘못된 리뷰 id입니다.' }, { status: 400 });
    }

    const review = await reviewUseCases.getReviewById(reviewId);
    if (!review) {
      return NextResponse.json({ error: '리뷰를 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, review }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: '리뷰 상세 조회 중 오류 발생', detail: String(error) }, { status: 500 });
  }
} 