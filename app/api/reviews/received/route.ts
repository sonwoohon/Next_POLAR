import { NextRequest, NextResponse } from 'next/server';
import { ReviewUseCases } from '@/backend/reviews/applications/usecases/ReviewUseCases';
import { SbReviewRepository } from '@/backend/reviews/infrastructures/repositories/SbReviewRepository';

const reviewUseCases = new ReviewUseCases(new SbReviewRepository());

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const uuid = searchParams.get('uuid');
  if (!uuid) {
    return NextResponse.json({ error: 'uuid 쿼리 파라미터가 필요합니다.' }, { status: 400 });
  }
  const reviews = await reviewUseCases.getReviewsByReceiverId(Number(uuid));
  return NextResponse.json({ success: true, reviews }, { status: 200 });
} 