import { NextRequest, NextResponse } from 'next/server';
import { UserWithdrawalUseCase } from '@/backend/users/auths/withdrawal/applications/usecases/UserWithdrawalUseCase';
import { SbWithdrawalUserRepository } from '@/backend/users/auths/withdrawal/infrastructures/repository/SbUserRepository';
import { WithdrawalRequestDto } from '@/backend/users/auths/withdrawal/applications/dtos/WithdrawalRequestDto';

export async function POST(req: NextRequest) {
  try {
    const { userId, confirmPassword, reason }: WithdrawalRequestDto = await req.json();

    const userRepository = new SbWithdrawalUserRepository();
    const usecase = new UserWithdrawalUseCase(userRepository);

    const result = await usecase.execute({ userId, confirmPassword, reason });

    return NextResponse.json(result, { status: 200 });
  } catch (e: unknown) {
    // 에러 타입 검증
    if (e instanceof Error) {
      return NextResponse.json(
        { success: false, error: e.message },
        { status: 400 }
      );
    }

    // 예상치 못한 에러 타입
    // console.error('User withdrawal error:', e);
    return NextResponse.json(
      { success: false, error: '회원 탈퇴 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
