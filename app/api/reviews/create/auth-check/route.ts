import { NextRequest, NextResponse } from 'next/server';
import { ReviewUseCases } from '@/backend/reviews/applications/usecases/ReviewUseCases';
import { SbReviewRepository } from '@/backend/reviews/infrastructures/repositories/SbReviewRepository';


const reviewUseCases = new ReviewUseCases(new SbReviewRepository());

// GET /api/reviews/create/auth-check - 리뷰 생성 권한 확인
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const nickname = searchParams.get('nickname');
    const helpId = searchParams.get('helpId');

    if (!nickname || !helpId) {
      return NextResponse.json(
        { error: 'nickname과 helpId가 필요합니다.' },
        { status: 400 }
      );
    }

    const dto: { nickname: string, helpId: number } = {
      nickname,
      helpId: Number(helpId),
    };

    const hasAccess = await reviewUseCases.checkCreateReviewAccess(dto.nickname, dto.helpId);

    return NextResponse.json({ hasAccess }, { status: 200 });
  } catch (error) {
    console.error('[API] 리뷰 생성 권한 확인 오류:', error);
    return NextResponse.json(
      { error: '권한 확인 중 오류 발생', detail: String(error) },
      { status: 500 }
    );
  }
} 