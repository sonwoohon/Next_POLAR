import { NextRequest, NextResponse } from 'next/server';
import {
  UploadImageUseCase,
  GetImageByUrlUseCase,
  DeleteImageUseCase,
} from '@/backend/images/applications/usecases/ImageUseCase';
import { SbImageRepository } from '@/backend/images/infrastructures/repositories/SbImageRepository';
<<<<<<< HEAD
import { SbUserRepository } from '@/backend/users/user/infrastructures/repositories/SbUserRepository';
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
=======
>>>>>>> 714e74345bf047750ce28a37052b6141b2547621

// 이미지 업로드 (POST)
export async function POST(
  request: NextRequest
): Promise<NextResponse<{ url: string } | { error: string }>> {
  console.log('[API] POST /api/images 호출됨');

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucketName = formData.get('bucketName') as string;
    const userId = formData.get('userId') as string;

    if (!file || !bucketName || !userId) {
      console.error('[API] 필수 파라미터 누락');
      return NextResponse.json(
        { error: '파일, 버킷명, 사용자 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    console.log(
      `[API] 이미지 업로드 시작 - 버킷: ${bucketName}, 사용자: ${userId}`
    );

    const uploadUseCase = new UploadImageUseCase(new SbImageRepository());
    const result = await uploadUseCase.execute(
      file,
      bucketName,
      parseInt(userId)
    );

    if (!result) {
      console.error('[API] 이미지 업로드 실패');
      return NextResponse.json(
        { error: '이미지 업로드에 실패했습니다.' },
        { status: 500 }
      );
    }

    console.log('[API] 이미지 업로드 성공:', result.url);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[API] 이미지 업로드 중 오류 발생:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 이미지 조회 (GET)
export async function GET(
  request: NextRequest
): Promise<NextResponse<{ url: string } | { error: string }>> {
  console.log('[API] GET /api/images 호출됨');

  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    const bucketName = searchParams.get('bucketName');

    if (!imageUrl || !bucketName) {
      console.error('[API] 필수 파라미터 누락');
      return NextResponse.json(
        { error: '이미지 URL과 버킷명이 필요합니다.' },
        { status: 400 }
      );
    }

    console.log(
      `[API] 이미지 조회 시작 - URL: ${imageUrl}, 버킷: ${bucketName}`
    );

    const getUseCase = new GetImageByUrlUseCase(new SbImageRepository());
    const result = await getUseCase.execute(imageUrl, bucketName);

    if (!result) {
      console.error('[API] 이미지를 찾을 수 없음');
      return NextResponse.json(
        { error: '이미지를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    console.log('[API] 이미지 조회 성공:', result.url);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[API] 이미지 조회 중 오류 발생:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 이미지 삭제 (DELETE)
export async function DELETE(
  request: NextRequest
): Promise<NextResponse<{ success: boolean } | { error: string }>> {
  console.log('[API] DELETE /api/images 호출됨');

  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    const bucketName = searchParams.get('bucketName');

    if (!imageUrl || !bucketName) {
      console.error('[API] 필수 파라미터 누락');
      return NextResponse.json(
        { error: '이미지 URL과 버킷명이 필요합니다.' },
        { status: 400 }
      );
    }

    console.log(
      `[API] 이미지 삭제 시작 - URL: ${imageUrl}, 버킷: ${bucketName}`
    );

    const deleteUseCase = new DeleteImageUseCase(new SbImageRepository());
    const success = await deleteUseCase.execute(imageUrl, bucketName);

    if (!success) {
      console.error('[API] 이미지 삭제 실패');
      return NextResponse.json(
        { error: '이미지 삭제에 실패했습니다.' },
        { status: 500 }
      );
    }

    console.log('[API] 이미지 삭제 성공');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] 이미지 삭제 중 오류 발생:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
