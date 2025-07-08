import { NextRequest, NextResponse } from 'next/server';

import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import { SbAuthRepository } from '@/(backend)/uesrs/infrastructures/repositories/SbAuthRepository';
import {
  CommonAuthUseCase,
  ValidationError,
} from '@/(backend)/uesrs/applications/usecases/CommonAuthUseCase';
import {
  UserResponseDto,
  UserUpdateRequestDto,
} from '@/(backend)/uesrs/applications/dtos/UserDtos';
import {
  entitiesToUserResponseDtos,
  entityToUserResponseDto,
} from '@/(backend)/uesrs/infrastructures/mappers/UserMapper';

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

// 의존성 주입을 위한 UseCase 인스턴스 생성
const createUseCase = () => {
  const repository = new SbAuthRepository();
  return new CommonAuthUseCase(repository);
};

// GET: 모든 사용자 조회
export async function GET(): Promise<NextResponse<UserResponseDto[] | any>> {
  try {
    console.log('GET /api/auths 호출됨');

    const useCase = createUseCase();
    console.log('UseCase 생성 완료');

    const users = await useCase.getAllUsers();
    console.log('사용자 조회 완료:', users.length, '명');

    // Entity를 DTO로 변환
    const userDtos = entitiesToUserResponseDtos(users);
    console.log('DTO 변환 완료:', userDtos.length, '개');

    return NextResponse.json(userDtos);
  } catch (error) {
    console.error('사용자 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: 사용자 정보 수정
export async function PUT(
  request: NextRequest
): Promise<NextResponse<UserResponseDto | any>> {
  try {
    const body: UserUpdateRequestDto = await request.json();
    const userId = request.nextUrl.searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { error: '사용자 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const useCase = createUseCase();

    // UseCase를 통한 비즈니스 로직 수행
    const updatedUser = await useCase.updateUserProfile(parseInt(userId), body);

    // Entity를 DTO로 변환하여 반환
    return NextResponse.json(entityToUserResponseDto(updatedUser));
  } catch (error) {
    console.error('사용자 수정 오류:', error);

    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
