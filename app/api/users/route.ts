import { NextRequest, NextResponse } from 'next/server';
import { getNicknameFromCookie } from '@/lib/jwt';
import { CommonUserUseCase } from '@/backend/users/user/applications/usecases/CommonUserUseCase';
import { SbUserRepository } from '@/backend/users/user/infrastructures/repositories/SbUserRepository';
import { UserProfileResponseDto } from '@/backend/users/user/applications/dtos/UserDtos';
import { entityToUserProfileResponseDto } from '@/backend/users/user/infrastructures/mappers/UserMapper';
import { ValidationError } from '@/backend/common/errors/ValidationError';

// UseCase 인스턴스 생성 함수
const createUseCase = () => {
  const userRepository = new SbUserRepository();
  return new CommonUserUseCase(userRepository);
};

// GET: 쿠키를 통한 로그인된 사용자 정보 조회
export async function GET(
  request: NextRequest
): Promise<NextResponse<UserProfileResponseDto | { error: string }>> {
  try {
    // 쿠키에서 사용자 ID 추출
    const userData = getNicknameFromCookie(request);
    const { nickname } = userData || {};

    if (!nickname) {
      console.error('[API] 사용자 ID가 없음 - 로그인 필요');
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const useCase = createUseCase();
    const user = await useCase.getUserById(nickname);

    if (!user) {
      console.error(`[API] 사용자를 찾을 수 없음 - ID: ${nickname}`);
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // Entity를 DTO로 변환
    const userDto = entityToUserProfileResponseDto(user);

    return NextResponse.json(userDto);
  } catch (error: unknown) {
    // 에러 타입 검증
    if (error instanceof Error) {
      console.error('[API] 사용자 조회 중 오류 발생:', error.message);
    } else {
      console.error('[API] 사용자 조회 중 예상치 못한 오류:', error);
    }
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: 쿠키를 통한 로그인된 사용자 정보 수정 (비밀번호 포함)
export async function PUT(
  request: NextRequest
): Promise<NextResponse<UserProfileResponseDto | { error: string }>> {
  try {
    const body = await request.json();

    // 쿠키에서 사용자 ID 추출
    const userData = getNicknameFromCookie(request);
    const { nickname } = userData || {};

    if (!nickname) {
      console.error('[API] 사용자 ID가 없음 - 로그인 필요');
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const useCase = createUseCase();

    // 모든 정보 수정 (비밀번호 포함)
    const updatedUser = await useCase.updateUserProfile(nickname, body);

    // Entity를 DTO로 변환하여 반환
    const userDto = entityToUserProfileResponseDto(updatedUser);

    return NextResponse.json(userDto);
  } catch (error: unknown) {
    // 에러 타입 검증
    if (error instanceof ValidationError) {
      console.error('[API] 검증 오류:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof Error) {
      console.error('[API] 사용자 수정 중 오류 발생:', error.message);
    } else {
      console.error('[API] 사용자 수정 중 예상치 못한 오류:', error);
    }

    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: 프로필 이미지 삭제 (빈 프로필로 설정)
export async function DELETE(
  request: NextRequest
): Promise<NextResponse<UserProfileResponseDto | { error: string }>> {
  try {
    // 쿠키에서 사용자 ID 추출
    const userData = getNicknameFromCookie(request);
    const { nickname } = userData || {};

    if (!nickname) {
      console.error('[API] 사용자 ID가 없음 - 로그인 필요');
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const useCase = createUseCase();

    // 프로필 이미지 삭제
    const updatedUser = await useCase.deleteProfileImage(nickname);

    // Entity를 DTO로 변환하여 반환
    const userDto = entityToUserProfileResponseDto(updatedUser);

    return NextResponse.json(userDto);
  } catch (error: unknown) {
    // 에러 타입 검증
    if (error instanceof ValidationError) {
      console.error('[API] 검증 오류:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof Error) {
      console.error('[API] 프로필 이미지 삭제 중 오류 발생:', error.message);
    } else {
      console.error('[API] 프로필 이미지 삭제 중 예상치 못한 오류:', error);
    }

    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
