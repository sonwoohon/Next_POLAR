import { NextRequest, NextResponse } from 'next/server';
import { ReviewUseCases } from '@/backend/reviews/applications/usecases/ReviewUseCases';
import { SbReviewRepository } from '@/backend/reviews/infrastructures/repositories/SbReviewRepository';
import { CreateReviewDto } from '@/backend/reviews/applications/dtos/ReviewDtos';
import { ReviewEntity } from '@/backend/reviews/domains/entities/review';

const reviewUseCases = new ReviewUseCases(new SbReviewRepository());

// GET /api/reviews?userId=... (이제 받은/작성한 리뷰는 각각 received, written에서 처리)
export async function GET(request: NextRequest) {
  return NextResponse.json({ error: '이 API에서는 리뷰 리스트를 조회할 수 없습니다. /api/reviews/received 또는 /api/reviews/written을 사용하세요.' }, { status: 400 });
}

// POST /api/reviews
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { helpId, writerId, receiverId, rating, text } = body;

    if (
      helpId === undefined ||
      writerId === undefined ||
      receiverId === undefined ||
      rating === undefined ||
      text === undefined
    ) {
      return NextResponse.json({ error: '필수 값이 누락되었습니다.' }, { status: 400 });
    }

    const createReviewDto = new CreateReviewDto(
      Number(helpId),
      Number(writerId),
      Number(receiverId),
      Number(rating),
      String(text)
    );

    // DTO를 Entity로 변환
    const reviewEntity = new ReviewEntity(
      undefined, // id는 DB에서 자동 생성
      createReviewDto.helpId,
      createReviewDto.writerId,
      createReviewDto.receiverId,
      createReviewDto.rating,
      createReviewDto.text,
      undefined // createdAt은 DB에서 자동 생성
    );

    const review = await reviewUseCases.createReview(reviewEntity);

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error: unknown) {
    // 에러 타입 검증
    if (error instanceof Error) {
      return NextResponse.json({ error: '리뷰 생성 중 오류 발생', detail: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: '리뷰 생성 중 오류 발생', detail: String(error) }, { status: 500 });
    }
  }
} 