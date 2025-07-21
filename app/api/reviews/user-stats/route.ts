import { NextRequest, NextResponse } from 'next/server';
import { getUuidByNickname } from '@/lib/getUserData';
import { supabase } from '@/backend/common/utils/supabaseClient';

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

    // nickname으로 UUID 조회
    const userId = await getUuidByNickname(nickname);
    if (!userId) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // star_points 테이블에서 해당 사용자의 데이터 조회
    const { data: starPointsData, error: starPointsError } = await supabase
      .from('star_points')
      .select('star_point_sum, review_total_count')
      .eq('user_id', userId)
      .single();

    if (starPointsError) {
      console.error('star_points 조회 오류:', starPointsError);
      // star_points 테이블에 데이터가 없으면 기본값 반환
      return NextResponse.json({
        averageRating: 0,
        reviewCount: 0,
      });
    }

    if (!starPointsData) {
      return NextResponse.json({
        averageRating: 0,
        reviewCount: 0,
      });
    }

    // 평균 평점 계산
    const { star_point_sum, review_total_count } = starPointsData;
    const averageRating =
      review_total_count > 0
        ? Math.round((star_point_sum / review_total_count) * 10) / 10 // 소수점 첫째자리까지
        : 0;

    const stats: UserReviewStats = {
      averageRating,
      reviewCount: review_total_count,
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
