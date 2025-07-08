import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET() {
  try {
    // 인증 필수
    const authResult = await getAuthenticatedUser();

    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    // 인증된 사용자의 설정 정보 반환
    return NextResponse.json({
      settings: {
        userId: authResult.user!.id,
        loginId: authResult.user!.loginId,
        // 여기서 DB에서 사용자 설정을 조회
        theme: 'dark',
        notifications: true,
        language: 'ko',
      },
    });
  } catch (e: unknown) {
    const errorMessage =
      e instanceof Error ? e.message : '설정 조회 중 오류가 발생했습니다.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT() {
  try {
    // 인증 필수
    const authResult = await getAuthenticatedUser();

    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    // 여기서 DB에 사용자 설정 업데이트
    // authResult.user!.id를 사용하여 해당 사용자의 설정만 업데이트

    return NextResponse.json({
      message: '설정이 업데이트되었습니다.',
      userId: authResult.user!.id,
    });
  } catch (e: unknown) {
    const errorMessage =
      e instanceof Error ? e.message : '설정 업데이트 중 오류가 발생했습니다.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
