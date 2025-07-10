import { NextRequest, NextResponse } from 'next/server';
import { ReviewUseCases } from '@/backend/reviews/applications/usecases/ReviewUseCases';
import { SbReviewRepository } from '@/backend/reviews/infrastructures/repositories/SbReviewRepository';
import { CreateReviewDto } from '@/backend/reviews/applications/dtos/ReviewDtos';
import { ReviewEntity } from '@/backend/reviews/domains/entities/review';

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
  } catch (error) {
    return NextResponse.json({ error: '리뷰 조회 중 오류 발생', detail: String(error) }, { status: 500 });
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

    const createReviewDto: CreateReviewDto = {
      helpId: Number(helpId),
      writerId: Number(writerId),
      receiverId: Number(receiverId),
      rating: Number(rating),
      text: String(text),
    };

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
  } catch (error) {
    return NextResponse.json({ error: '리뷰 생성 중 오류 발생', detail: String(error) }, { status: 500 });
  }
} 