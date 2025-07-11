import { generateAccessToken } from '@/lib/jwt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// POST /api/user/refresh
export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh-token');

    if (!refreshToken) {
      return NextResponse.json(
        { error: '리프레시 토큰이 없습니다.' },
        { status: 401 }
      );
    }

    // refresh token 검증
    const decoded = jwt.verify(
      refreshToken.value,
      process.env.REFRESH_SECRET!
    ) as { id: number; loginId: string };

    // 새 access token 발급
    const newAccessToken = generateAccessToken({
      id: decoded.id,
      loginId: decoded.loginId,
    });

    // 새 쿠키 설정
    cookieStore.set('access-token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60,
      path: '/',
    });

    return NextResponse.json({ message: '토큰이 갱신되었습니다.' });
  } catch (error: unknown) {
    // JWT 관련 에러 타입 체크
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: '유효하지 않은 리프레시 토큰입니다.' },
        { status: 401 }
      );
    }

    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json(
        { error: '리프레시 토큰이 만료되었습니다.' },
        { status: 401 }
      );
    }

    if (error instanceof jwt.NotBeforeError) {
      return NextResponse.json(
        { error: '리프레시 토큰이 아직 유효하지 않습니다.' },
        { status: 401 }
      );
    }

    // 기타 예상치 못한 에러
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: '토큰 갱신 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
