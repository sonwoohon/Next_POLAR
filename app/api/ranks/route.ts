import { NextResponse } from "next/server";
import { SbAuthRepository } from "@/app/(backend)/auths/infrastructures/repositories/SbAuthRepository";
import { SignUpUsecase } from "@/app/(backend)/auths/applications/usecases/SignUpUsecase";
import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";



export async function GET() {
  try {
    // 3. Repository 인스턴스 생성 및 Usecase에 주입
    const supabase: SupabaseClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const authRepository = new SbAuthRepository(supabase);

    const signUpUsecase = new SignUpUsecase(authRepository);
    const result = await signUpUsecase.execute(signUpDto);

    return NextResponse.json({ success: true, user: result }, { status: 201 });

  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 400 });
  }


}