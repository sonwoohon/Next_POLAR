import { LoginUseCaseImpl } from '@/app/(backend)/auths/applications/usecases/LoginUseCase';
import { LoginRepository } from '@/app/(backend)/auths/infrastructures/LoginRepository';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { loginId, password } = await req.json();
    const usecase = new LoginUseCaseImpl(new LoginRepository());
    const result = await usecase.execute({ loginId, password });
    // 비밀번호 등 민감 정보는 응답에서 제외
    const { ...userWithoutPassword } = result.user;

    const cookieStore = await cookies();
    cookieStore.set('access-token', result.accessToken);
    cookieStore.set('refresh-token', result.refreshToken);

    return NextResponse.json({
      user: userWithoutPassword,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
