import { SignUpUsecase } from '@/backend/auths/signup/applications/usecases/SignUpUseCase';
import { SbAuthRepository } from '@/backend/auths/signup/infrastructures/repositories/SbSignUpRepository';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export interface SignUpDto {
  name: string;
  phone_number: string;
  password: string;
  email: string;
  age?: number;
  profile_img_url?: string;
  address?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 2. DTO 생성 (body에서 필요한 값만 추출)
    const signUpDto: SignUpDto = {
      name: body.name,
      phone_number: body.phone_number,
      password: body.password,
      email: body.email,
      age: body.age,
      profile_img_url: body.profile_img_url,
      address: body.address,
    };

    // 3. Repository 인스턴스 생성 및 Usecase에 주입
    const supabase: SupabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const authRepository = new SbAuthRepository(supabase);

    const signUpUsecase = new SignUpUsecase(authRepository);
    const result = await signUpUsecase.execute(signUpDto);

    return NextResponse.json({ success: true, user: result }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : '알 수 없는 오류가 발생했습니다.';
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 400 }
    );
  }
}
