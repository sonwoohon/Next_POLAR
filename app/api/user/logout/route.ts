import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAuthenticatedUser } from '@/lib/auth';
;

export async function POST(request: NextRequest) {
  try {
    // 인증 확인 (선택사항 - 로그아웃은 인증 없이도 가능)
    const authResult = await getAuthenticatedUser(request);


    const cookieStore = await cookies();

    // 쿠키 삭제
    cookieStore.delete('access-token');
    cookieStore.delete('refresh-token');

    return NextResponse.json({
      message: '로그아웃되었습니다.',
      wasAuthenticated: !!authResult.user,
    });
  } catch (e: unknown) {
    const errorMessage =
      e instanceof Error ? e.message : '로그아웃 처리 중 오류가 발생했습니다.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
