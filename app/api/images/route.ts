import { NextRequest, NextResponse } from 'next/server';
import {
  UploadImageUseCase,
  GetImageByUrlUseCase,
  DeleteImageUseCase,
} from '@/backend/images/applications/usecases/ImageUseCase';
import { SbImageRepository } from '@/backend/images/infrastructures/repositories/SbImageRepository';
import { SbUserRepository } from '@/backend/users/user/infrastructures/repositories/SbUserRepository';
import { CommonUserUseCase } from '@/backend/users/user/applications/usecases/CommonUserUseCase';
// import { UpdateProfileImageUseCase } from '@/backend/images/applications/usecases/UpdateProfileImageUseCase';
import { getUserIdFromCookie } from '@/lib/jwt';
import {
  UploadImageRequestDto,
  GetImageRequestDto,
  DeleteImageRequestDto,
} from '@/backend/images/applications/dtos/ImageDtos';
// import { urlToUrlWithoutFlightMarker } from 'next/dist/client/components/router-reducer/fetch-server-response';

// 공통 헬퍼 함수들
type AuthResult = 
  | { error: string; status: number }
  | { userId: number; user: unknown };

async function authenticateAndGetUser(request: NextRequest): Promise<AuthResult> {
  const userId = getUserIdFromCookie(request);
  if (!userId) {
    return { error: '유효하지 않은 사용자 ID입니다.', status: 401 };
  }

  const userRepository = new SbUserRepository();
  const user = await userRepository.getUserById(Number(userId));
  if (!user) {
    return { error: '사용자를 찾을 수 없습니다.', status: 404 };
  }

  return { userId: Number(userId), user };
}

function createErrorResponse(message: string, status: number = 500) {
  return NextResponse.json({ error: message }, { status });
}

// 공통 Repository 인스턴스 생성
function createRepositories() {
  return {
    userRepository: new SbUserRepository(),
    imageRepository: new SbImageRepository(),
    userUseCase: new CommonUserUseCase(new SbUserRepository())
  };
}

// 기존 프로필 이미지 삭제 헬퍼 함수
async function deleteExistingProfileImage(userId: number, bucketName: string = 'profile-images'): Promise<void> {
  const { userRepository, imageRepository } = createRepositories();
  
  const user = await userRepository.getUserById(userId);
  if (user && user.profileImgUrl && user.profileImgUrl.trim() !== '') {
    console.log(`[API] 기존 프로필 이미지 삭제 시작 - URL: ${user.profileImgUrl}`);
    
    await imageRepository.deleteImage(user.profileImgUrl, bucketName);
    console.log('[API] 기존 프로필 이미지 삭제 완료');
  }
}

// 공통 에러 처리 헬퍼 함수
function handleError<T>(error: unknown, operation: string): NextResponse<T> {
  if (error instanceof Error) {
    console.error(`[API] ${operation} 중 오류 발생:`, error.message);
  } else {
    console.error(`[API] ${operation} 중 예상치 못한 오류:`, error);
  }
  return NextResponse.json(
    { error: '서버 오류가 발생했습니다.' } as T,
    { status: 500 }
  );
}

// function createSuccessResponse(data: any, message: string, status: number = 200) {
//   return NextResponse.json({
//     success: true,
//     message,
//     ...data
//   }, { status });
// }

// 이미지 업로드 (POST)
export async function POST(
  request: NextRequest
): Promise<NextResponse<{ url: string } | { error: string }>> {
  console.log('[API] POST /api/images 호출됨');

  try {
    // 공통 헬퍼 함수로 인증 및 사용자 정보 가져오기
    const authResult = await authenticateAndGetUser(request);
    if ('error' in authResult) {
      return createErrorResponse(authResult.error, authResult.status);
    }

    const formData = await request.formData();
    
    // FormData 전체 내용 로깅
    console.log('[API] FormData 전체 내용:');
    for (const [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
      if (value instanceof File) {
        console.log(`    - 파일명: ${value.name}`);
        console.log(`    - 크기: ${value.size} bytes`);
        console.log(`    - 타입: ${value.type}`);
      }
    }
    
    // 여러 가능한 파일 필드명을 시도
    const possibleFileKeys = ['file', 'image', 'upload', 'photo', 'profileImage'];
    let file: File | null = null;
    let foundKey = '';

    for (const key of possibleFileKeys) {
      const value = formData.get(key);
      if (value instanceof File) {
        file = value;
        foundKey = key;
        console.log(`[API] 파일을 찾았습니다 - 키: ${key}`);
        break;
      }
    }
    
    console.log('[API] FormData 내용 요약:', {
      hasFile: !!file,
      fileType: file?.constructor.name,
      fileName: file instanceof File ? file.name : 'Not a File',
      foundKey: foundKey || 'Not Found',
      formDataKeys: Array.from(formData.keys())
    });

    if (!file || !(file instanceof File)) {
      console.error('[API] 파일이 누락되었거나 유효하지 않습니다');
      return createErrorResponse('유효한 파일이 필요합니다.', 400);
    }

    const requestData: UploadImageRequestDto = {
      file: file as File,
    };

    const bucketName = 'profile-images'; // 고정값

    console.log(
      `[API] 이미지 업로드 시작 - 버킷: ${bucketName}, 사용자: ${authResult.userId}`
    );

    // 1. 기존 프로필 이미지 삭제
    await deleteExistingProfileImage(authResult.userId, bucketName);

    // 2. 새 이미지 업로드
    const { imageRepository, userUseCase } = createRepositories();
    const uploadUseCase = new UploadImageUseCase(imageRepository);
    const result = await uploadUseCase.execute(
      requestData.file,
      bucketName,
      authResult.userId
    );

    if (!result) {
      console.error('[API] 이미지 업로드 실패');
      return createErrorResponse('이미지 업로드에 실패했습니다.', 500);
    }

    // 3. 사용자 테이블에 프로필 이미지 URL 업데이트
    const updatedUser = await userUseCase.updateUserProfile(authResult.userId, {
      profileImgUrl: result.url
    });

    if (!updatedUser) {
      console.error('[API] 사용자 정보 업데이트 실패');
      return createErrorResponse('사용자 정보 업데이트에 실패했습니다.', 500);
    }

    console.log('[API] 이미지 업로드 및 사용자 정보 업데이트 성공:', result.url);
    return NextResponse.json(result);
  } catch (error: unknown) {
    return handleError<{ url: string } | { error: string }>(error, '이미지 업로드');
  }
}

// 이미지 조회 (GET)
export async function GET(
  request: NextRequest
): Promise<NextResponse<{ url: string } | { error: string }>> {
  console.log('[API] GET /api/images 호출됨');

  try {
    const { searchParams } = new URL(request.url);
    const requestData: GetImageRequestDto = {
      url: searchParams.get('url') || '',
      bucketName: searchParams.get('bucketName') || '',
    };

    if (!requestData.url || !requestData.bucketName) {
      console.error('[API] 필수 파라미터 누락');
      return NextResponse.json(
        { error: '이미지 URL과 버킷명이 필요합니다.' },
        { status: 400 }
      );
    }

    console.log(
      `[API] 이미지 조회 시작 - URL: ${requestData.url}, 버킷: ${requestData.bucketName}`
    );

    const getUseCase = new GetImageByUrlUseCase(new SbImageRepository());
    const result = await getUseCase.execute(requestData.url, requestData.bucketName);

    if (!result) {
      console.error('[API] 이미지를 찾을 수 없음');
      return NextResponse.json(
        { error: '이미지를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    console.log('[API] 이미지 조회 성공:', result.url);
    return NextResponse.json(result);
  } catch (error: unknown) {
    return handleError<{ url: string } | { error: string }>(error, '이미지 조회');
  }
}

// 이미지 삭제 (DELETE)
export async function DELETE(
  request: NextRequest
): Promise<NextResponse<{ success: boolean } | { error: string }>> {
  console.log('[API] DELETE /api/images 호출됨');

  try {
    // 공통 헬퍼 함수로 인증 및 사용자 정보 가져오기
    const authResult = await authenticateAndGetUser(request);
    if ('error' in authResult) {
      return createErrorResponse(authResult.error, authResult.status);
    }

    console.log(
      `[API] 프로필 이미지 삭제 시작 - 사용자: ${authResult.userId}`
    );

    // 1. 사용자 정보 조회하여 현재 프로필 이미지 URL 확인
    const { userRepository, imageRepository, userUseCase } = createRepositories();
    const user = await userRepository.getUserById(authResult.userId);
    
    if (!user) {
      console.error('[API] 사용자를 찾을 수 없음');
      return createErrorResponse('사용자를 찾을 수 없습니다.', 404);
    }

    const currentProfileImageUrl = user.profileImgUrl;
    
    // 2. 기존 프로필 이미지가 있으면 Supabase 스토리지에서 삭제
    if (currentProfileImageUrl && currentProfileImageUrl.trim() !== '') {
      console.log(`[API] 기존 프로필 이미지 파일 삭제 시작 - URL: ${currentProfileImageUrl}`);
      
      const deleteSuccess = await imageRepository.deleteImage(
        currentProfileImageUrl,
        'profile-images'
      );

      if (!deleteSuccess) {
        console.error('[API] 프로필 이미지 파일 삭제 실패');
        return createErrorResponse('프로필 이미지 파일 삭제에 실패했습니다.', 500);
      }

      console.log('[API] 프로필 이미지 파일 삭제 성공');
    } else {
      console.log('[API] 삭제할 프로필 이미지가 없음');
    }

    // 3. 사용자 테이블에서 프로필 이미지 URL을 빈 문자열로 업데이트
    const updatedUser = await userUseCase.deleteProfileImage(authResult.userId);

    if (!updatedUser) {
      console.error('[API] 사용자 정보 업데이트 실패');
      return createErrorResponse('사용자 정보 업데이트에 실패했습니다.', 500);
    }

    console.log('[API] 프로필 이미지 삭제 성공');
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return handleError<{ success: boolean } | { error: string }>(error, '프로필 이미지 삭제');
  }
}
