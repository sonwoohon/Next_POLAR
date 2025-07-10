import { NextRequest, NextResponse } from 'next/server';
<<<<<<< HEAD
import { UserWithdrawalUseCase } from '@/backend/users/withdrawal/applications/usecases/UserWithdrawalUseCase';
import { SbWithdrawalUserRepository } from '@/backend/users/withdrawal/infrastructures/SbUserRepository';
=======
import { UserWithdrawalUseCase } from '@/backend/users/auths/withdrawal/applications/usecases/UserWithdrawalUseCase';
import { SbWithdrawalUserRepository } from '@/backend/users/auths/withdrawal/infrastructures/SbUserRepository';
>>>>>>> 714e74345bf047750ce28a37052b6141b2547621

export async function POST(req: NextRequest) {
  const { userId, type } = await req.json();
  const userRepository = new SbWithdrawalUserRepository();
  const usecase = new UserWithdrawalUseCase(userRepository);
  try {
    await usecase.execute(userId, type);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 400 }
    );
  }
}
