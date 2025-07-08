import { NextRequest, NextResponse } from 'next/server';
import { CommonUserUseCase, ValidationError } from '@/backend/uesrs/applications/usecases/CommonUserUseCase';
import { SbUserRepository } from '@/backend/uesrs/infrastructures/repositories/SbUserRepository';
import { 
  UserUpdateRequestDto, 
  UserProfileResponseDto
} from '@/backend/uesrs/applications/dtos/UserDtos';
import {
  entityToUserProfileResponseDto
} from '@/backend/uesrs/infrastructures/mappers/UserMapper';

// 의존성 주입을 위한 UseCase 인스턴스 생성
const createUseCase = () => {
  const repository = new SbUserRepository();
  return new CommonUserUseCase(repository);
};

// 쿠키에서 사용자 ID 추출 (임시 함수)
const getUserIdFromCookie = (request: NextRequest): number | null => {
  // 실제로는 쿠키에서 사용자 ID를 파싱하는 로직 필요
  // 여기서는 임시로 고정된 사용자 ID를 반환한다고 가정
  return 1; // 임시로 사용자 ID 1을 반환
};

// GET: 쿠키를 통한 로그인된 사용자 정보 조회
export async function GET(request: NextRequest): Promise<NextResponse<UserProfileResponseDto | any>> {
  console.log('[API] GET /api/users 호출됨');
  
  try {
    // 쿠키에서 사용자 ID 추출
    const userId = getUserIdFromCookie(request);
    console.log(`[API] 쿠키에서 추출한 사용자 ID: ${userId}`);
    
    if (!userId) {
      console.error('[API] 사용자 ID가 없음 - 로그인 필요');
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }
    
    console.log(`[API] UseCase 생성 시작 - 사용자 ID: ${userId}`);
    const useCase = createUseCase();
    console.log('[API] UseCase 생성 완료');
    
    console.log(`[API] 사용자 조회 시작 - ID: ${userId}`);
    const user = await useCase.getUserById(userId);
    
    if (!user) {
      console.error(`[API] 사용자를 찾을 수 없음 - ID: ${userId}`);
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    console.log(`[API] 사용자 조회 완료 - ID: ${user.id}`);

    // Entity를 DTO로 변환
    console.log('[API] DTO 변환 시작');
    const userDto = entityToUserProfileResponseDto(user);
    console.log('[API] DTO 변환 완료', userDto);

    console.log('[API] 응답 반환');
    return NextResponse.json(userDto);
  } catch (error) {
    console.error('[API] 사용자 조회 중 오류 발생:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: 쿠키를 통한 로그인된 사용자 정보 수정 (비밀번호 포함)
export async function PUT(request: NextRequest): Promise<NextResponse<UserProfileResponseDto | any>> {
  console.log('[API] PUT /api/users 호출됨');
  
  try {
    const body: UserUpdateRequestDto = await request.json();
    console.log('[API] 요청 본문:', body);
    
    // 쿠키에서 사용자 ID 추출
    const userId = getUserIdFromCookie(request);
    console.log(`[API] 쿠키에서 추출한 사용자 ID: ${userId}`);
    
    if (!userId) {
      console.error('[API] 사용자 ID가 없음 - 로그인 필요');
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    console.log(`[API] UseCase 생성 시작 - 사용자 ID: ${userId}`);
    const useCase = createUseCase();
    console.log('[API] UseCase 생성 완료');
    
    // 모든 정보 수정 (비밀번호 포함)
    console.log(`[API] 사용자 프로필 업데이트 시작 - ID: ${userId}`);
    const updatedUser = await useCase.updateUserProfile(userId, body);
    console.log(`[API] 사용자 프로필 업데이트 완료 - ID: ${userId}`);

    // Entity를 DTO로 변환하여 반환
    console.log('[API] DTO 변환 시작');
    const userDto = entityToUserProfileResponseDto(updatedUser);
    console.log('[API] DTO 변환 완료', userDto);
    
    console.log('[API] 응답 반환');
    return NextResponse.json(userDto);

  } catch (error) {
    console.error('[API] 사용자 수정 중 오류 발생:', error);
    
    if (error instanceof ValidationError) {
      console.error('[API] 검증 오류:', error.message);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: 프로필 이미지 삭제 (빈 프로필로 설정)
export async function DELETE(request: NextRequest): Promise<NextResponse<UserProfileResponseDto | any>> {
  console.log('[API] DELETE /api/users 호출됨');
  
  try {
    // 쿠키에서 사용자 ID 추출
    const userId = getUserIdFromCookie(request);
    console.log(`[API] 쿠키에서 추출한 사용자 ID: ${userId}`);
    
    if (!userId) {
      console.error('[API] 사용자 ID가 없음 - 로그인 필요');
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    console.log(`[API] UseCase 생성 시작 - 사용자 ID: ${userId}`);
    const useCase = createUseCase();
    console.log('[API] UseCase 생성 완료');
    
    // 프로필 이미지 삭제
    console.log(`[API] 프로필 이미지 삭제 시작 - ID: ${userId}`);
    const updatedUser = await useCase.deleteProfileImage(userId);
    console.log(`[API] 프로필 이미지 삭제 완료 - ID: ${userId}`);

    // Entity를 DTO로 변환하여 반환
    console.log('[API] DTO 변환 시작');
    const userDto = entityToUserProfileResponseDto(updatedUser);
    console.log('[API] DTO 변환 완료', userDto);
    
    console.log('[API] 응답 반환');
    return NextResponse.json(userDto);

  } catch (error) {
    console.error('[API] 프로필 이미지 삭제 중 오류 발생:', error);
    
    if (error instanceof ValidationError) {
      console.error('[API] 검증 오류:', error.message);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 