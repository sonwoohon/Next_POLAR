import { LoginRequestDTO } from '@/app/(backend)/auths/login/applications/dtos/LoginReqeust';
import { LoginUseCase } from '@/app/(backend)/auths/login/applications/usecases/LoginUseCase';
import { LoginRepository } from '@/app/(backend)/auths/login/infrastructures/LoginRepository';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { loginId, password } = await req.json();
    const usecase = new LoginUseCase(new LoginRepository());
    const result = await usecase.execute(
      new LoginRequestDTO(loginId, password)
    );

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
