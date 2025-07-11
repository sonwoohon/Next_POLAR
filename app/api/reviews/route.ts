import { NextRequest, NextResponse } from 'next/server';
import { ReviewUseCases } from '@/backend/reviews/applications/usecases/ReviewUseCases';
import { SbReviewRepository } from '@/backend/reviews/infrastructures/repositories/SbReviewRepository';
import { CreateReviewDto } from '@/backend/reviews/applications/dtos/ReviewDtos';

const reviewUseCases = new ReviewUseCases(new SbReviewRepository());

// GET /api/reviews?helpId=...
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const helpId = searchParams.get('helpId');

  try {
    if (helpId) {
      const reviews = await reviewUseCases.getReviewsByHelpId(Number(helpId));
      return NextResponse.json({ success: true, reviews }, { status: 200 });
    }
    return NextResponse.json({ error: 'helpId 쿼리 파라미터가 필요합니다.' }, { status: 400 });
  } catch (error: unknown) {
    // 에러 타입 검증
    if (error instanceof Error) {
      return NextResponse.json({ error: '리뷰 조회 중 오류 발생', detail: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: '리뷰 조회 중 오류 발생', detail: String(error) }, { status: 500 });
    }
  }
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

    const review = await reviewUseCases.createReview(createReviewDto);

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