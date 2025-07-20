import { NextRequest, NextResponse } from 'next/server';
import { ReviewUseCases } from '@/backend/reviews/applications/usecases/ReviewUseCases';
import { SbReviewRepository } from '@/backend/reviews/infrastructures/repositories/SbReviewRepository';

const reviewUseCases = new ReviewUseCases(new SbReviewRepository());

interface UserReviewStats {
  averageRating: number;
  reviewCount: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const nickname = searchParams.get('nickname');

    if (!nickname) {
      return NextResponse.json(
        { error: 'nickname이 필요합니다.' },
        { status: 400 }
      );
    }

    // 받은 리뷰 조회
    const receivedReviews = await reviewUseCases.getReviewsByReceiverNickname(
      nickname
    );

    if (receivedReviews.length === 0) {
      return NextResponse.json({
        averageRating: 0,
        reviewCount: 0,
      });
    }

    // 평균 평점 계산
    const totalRating = receivedReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating =
      Math.round((totalRating / receivedReviews.length) * 10) / 10; // 소수점 첫째자리까지

    const stats: UserReviewStats = {
      averageRating,
      reviewCount: receivedReviews.length,
    };

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error('사용자 리뷰 통계 조회 중 오류:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : '사용자 리뷰 통계 조회 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
