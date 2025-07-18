import { NextRequest, NextResponse } from 'next/server';
import { ReviewUseCases } from '@/backend/reviews/applications/usecases/ReviewUseCases';
import { SbReviewRepository } from '@/backend/reviews/infrastructures/repositories/SbReviewRepository';
import { getNicknameByUuid } from '@/lib/getUserData';

const reviewUseCases = new ReviewUseCases(new SbReviewRepository());

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const { reviewId } = await params;
    const reviewIdNum = Number(reviewId);
    if (isNaN(reviewIdNum)) {
      return NextResponse.json({ error: '잘못된 리뷰 id입니다.' }, { status: 400 });
    }

    const review = await reviewUseCases.getReviewById(reviewIdNum);
    if (!review) {
      return NextResponse.json({ error: '리뷰를 찾을 수 없습니다.' }, { status: 404 });
    }

    // UUID를 nickname으로 변환
    const writerNickname = await getNicknameByUuid(review.writerId);
    const receiverNickname = await getNicknameByUuid(review.receiverId);

    if (!writerNickname || !receiverNickname) {
      throw new Error('사용자 정보를 찾을 수 없습니다.');
    }

    const reviewResponse = {
      id: review.id,
      helpId: review.helpId,
      writerNickname,
      receiverNickname,
      rating: review.rating,
      text: review.text,
      reviewImgUrl: review.reviewImgUrl,
      createdAt: review.createdAt?.toISOString() || new Date().toISOString(),
    };

    return NextResponse.json({ success: true, review: reviewResponse }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: '리뷰 상세 조회 중 오류 발생', detail: String(error) }, { status: 500 });
  }
} 