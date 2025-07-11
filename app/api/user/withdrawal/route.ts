import { NextRequest, NextResponse } from 'next/server';
import { UserWithdrawalUseCase } from '@/backend/users/withdrawal/applications/usecases/UserWithdrawalUseCase';
import { SbWithdrawalUserRepository } from '@/backend/users/withdrawal/infrastructures/SbUserRepository';

export async function POST(req: NextRequest) {
  try {
    const { userId, confirmPassword, reason } = await req.json();
    
    const userRepository = new SbWithdrawalUserRepository();
    const usecase = new UserWithdrawalUseCase(userRepository);
    
    const result = await usecase.execute({ userId, confirmPassword, reason });
    
    return NextResponse.json(result, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 400 }
    );
  }
}
