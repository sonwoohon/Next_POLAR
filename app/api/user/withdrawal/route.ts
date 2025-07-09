import { NextRequest, NextResponse } from 'next/server';
import { UserWithdrawalUseCase } from '@/backend/uesrs/auths/withdrawal/applications/usecases/UserWithdrawalUseCase';
import { SbUserRepository } from '@/backend/uesrs/infrastructures/repositories/SbUserRepository';

export async function POST(req: NextRequest) {
    const { userId, type } = await req.json();
    const userRepository = new SbUserRepository ();
    const usecase = new UserWithdrawalUseCase(userRepository);
    try {
        await usecase.execute(userId, type);
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 400 });
    }
} 