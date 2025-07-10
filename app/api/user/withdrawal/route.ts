import { NextRequest, NextResponse } from 'next/server';
import { UserWithdrawalUseCase } from '@/backend/users/auths/withdrawal/applications/usecases/UserWithdrawalUseCase';
import { SbWithdrawalUserRepository } from '@/backend/users/auths/withdrawal/infrastructures/SbUserRepository';

export async function POST(req: NextRequest) {
    const { userId, type } = await req.json();
    const userRepository = new SbWithdrawalUserRepository();
    const usecase = new UserWithdrawalUseCase(userRepository);
    try {
        await usecase.execute(userId, type);
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 400 });
    }
} 