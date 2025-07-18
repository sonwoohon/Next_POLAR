import { NextRequest, NextResponse } from 'next/server';
import { ReviewUseCases } from '@/backend/reviews/applications/usecases/ReviewUseCases';
import { SbReviewRepository } from '@/backend/reviews/infrastructures/repositories/SbReviewRepository';
import { ReviewCreateAccessRequestDto } from '@/backend/reviews/applications/dtos/ReviewDtos';

const reviewUseCases = new ReviewUseCases(new SbReviewRepository());

// GET /api/helps/[helpId]/create-review - 리뷰 생성 권한 확인
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ helpId: string }> }
) {
  try {
    const { helpId } = await params;
    const { searchParams } = new URL(request.url);
    const writerNickname = searchParams.get('writerNickname');

    if (!writerNickname) {
      return NextResponse.json(
        { error: 'writerNickname이 필요합니다.' },
        { status: 400 }
      );
    }

    const dto: ReviewCreateAccessRequestDto = {
      nickname: writerNickname,
      helpId: Number(helpId),
    };

    const hasAccess = await reviewUseCases.checkCreateReviewAccess(dto);

    return NextResponse.json({ hasAccess }, { status: 200 });
  } catch (error) {
    console.error('[API] 리뷰 생성 권한 확인 오류:', error);
    return NextResponse.json(
      { error: '권한 확인 중 오류 발생', detail: String(error) },
      { status: 500 }
    );
  }
} 