import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromCookie } from '@/lib/jwt';
import { UploadImageUseCase, GetImageByUrlUseCase, DeleteImageUseCase } from '@/backend/images/applications/usecases/ImageUseCase';
import { SbImageRepository } from '@/backend/images/infrastructures/repositories/SbImageRepository';
import { SbUserRepository } from '@/backend/users/infrastructures/repositories/SbUserRepository';
import { UpdateProfileImageUseCase } from '@/backend/images/applications/usecases/UpdateProfileImageUseCase';

// 공통 헬퍼 함수들
async function authenticateAndGetUser(request: NextRequest) {
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

function createSuccessResponse(data: any, message: string, status: number = 200) {
  return NextResponse.json({
    success: true,
    message,
    ...data
  }, { status });
}

// 이미지 업로드 (POST)
export async function POST(request: NextRequest) {
  console.log('[API] 이미지 업로드 요청 시작');
  
  try {
    // 사용자 인증 및 조회
    const authResult = await authenticateAndGetUser(request);
    if ('error' in authResult) {
      return createErrorResponse(authResult.error, authResult.status);
    }
    const { userId, user } = authResult;

    // FormData에서 파일 추출
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return createErrorResponse('업로드할 이미지 파일이 없습니다.', 400);
    }

    // 버킷명 설정 (프로필 이미지용)
    const bucketName = 'profile-images';

    // 기존 프로필 이미지가 있으면 삭제
    if (user.profileImgUrl && user.profileImgUrl.trim() !== '') {
      const imageRepository = new SbImageRepository();
      const deleteImageUseCase = new DeleteImageUseCase(imageRepository);
      await deleteImageUseCase.execute(user.profileImgUrl!, bucketName);
    }

    // 새 이미지 업로드
    const imageRepository = new SbImageRepository();
    const uploadUseCase = new UploadImageUseCase(imageRepository);
    const imageUrl = await uploadUseCase.execute(file, bucketName, userId);

    // 업로드된 이미지 URL을 user 테이블에 업데이트
    const updateProfileImageUseCase = new UpdateProfileImageUseCase();
    await updateProfileImageUseCase.execute(user, userId, imageUrl.url);

    console.log('[API] 이미지 업로드 및 프로필 이미지 업데이트 성공');
    return createSuccessResponse(
      { image: imageUrl },
      '이미지가 성공적으로 업로드되고 프로필 이미지가 업데이트되었습니다.'
    );

  } catch (error: any) {
    console.error('[API] 이미지 업로드 중 오류 발생:', error);
    return createErrorResponse('이미지 업로드에 실패했습니다.');
  }
}

// 이미지 조회 (GET)
export async function GET(request: NextRequest) {
  console.log('[API] 프로필 이미지 URL 조회 요청 시작');
  try {
    // 사용자 인증 및 조회
    const authResult = await authenticateAndGetUser(request);
    if ('error' in authResult) {
      return createErrorResponse(authResult.error, authResult.status);
    }
    const { userId, user } = authResult;

    // 프로필 이미지가 있는 경우에만 이미지 조회 UseCase 실행
    if (user.profileImgUrl && user.profileImgUrl.trim() !== '') {
      const imageRepository = new SbImageRepository();
      const getImageUseCase = new GetImageByUrlUseCase(imageRepository);
      
      try {
        const imageInfo = await getImageUseCase.execute(user.profileImgUrl!, 'profile-images');
        if (imageInfo) {
          return createSuccessResponse(
            { image: imageInfo },
            '프로필 이미지를 성공적으로 조회했습니다.'
          );
        }
      } catch (error) {
        console.warn('[API] 이미지 조회 실패, 기본 URL 반환:', error);
      }
    }

    // 이미지가 없거나 조회 실패 시 기본 URL 반환
    return createSuccessResponse(
      { image: { url: user.profileImgUrl || '' } },
      '프로필 이미지 URL을 성공적으로 조회했습니다.'
    );
  } catch (error: any) {
    console.error('[API] 프로필 이미지 URL 조회 중 오류 발생:', error);
    return createErrorResponse('프로필 이미지 URL 조회에 실패했습니다.');
  }
}

// 이미지 삭제 (DELETE)
export async function DELETE(request: NextRequest) {
  console.log('[API] 이미지 삭제 요청 시작');
  
  try {
    // 사용자 인증 및 조회
    const authResult = await authenticateAndGetUser(request);
    if ('error' in authResult) {
      return createErrorResponse(authResult.error, authResult.status);
    }
    const { userId, user } = authResult;

    // 프로필 이미지 URL이 있는지 확인
    if (!user.profileImgUrl || user.profileImgUrl.trim() === '') {
      console.log('[API] 삭제할 프로필 이미지가 없습니다.');
      return createSuccessResponse(
        {},
        '삭제할 프로필 이미지가 없습니다.'
      );
    }

    // 이미지 삭제 UseCase 실행
    const imageRepository = new SbImageRepository();
    const deleteImageUseCase = new DeleteImageUseCase(imageRepository);
    
    const deleteSuccess = await deleteImageUseCase.execute(user.profileImgUrl!, 'profile-images');
    if (!deleteSuccess) {
      console.error('[API] 이미지 파일 삭제에 실패했습니다.');
      return createErrorResponse('이미지 파일 삭제에 실패했습니다.');
    }

    console.log('[API] Supabase Storage 이미지 삭제 성공');

    // 유저 테이블의 profileImgUrl을 빈 문자열로 업데이트
    const updateProfileImageUseCase = new UpdateProfileImageUseCase();
    const updateResult = await updateProfileImageUseCase.execute(user, userId, '');
    if (!updateResult) {
      console.error('[API] 유저 테이블 업데이트 실패');
      return createErrorResponse('유저 정보 업데이트에 실패했습니다.');
    }

    console.log('[API] 이미지 삭제 및 유저 정보 업데이트 성공');
    return createSuccessResponse(
      { user: updateResult.toJSON() },
      '프로필 이미지가 성공적으로 삭제되었습니다.'
    );

  } catch (error: any) {
    console.error('[API] 이미지 삭제 중 오류 발생:', error);
    return createErrorResponse('이미지 삭제에 실패했습니다.');
  }
} 