import { NextRequest, NextResponse } from 'next/server';
import {
  UploadImageUseCase,
  GetImageByUrlUseCase,
  DeleteImageUseCase,
} from '@/backend/images/applications/usecases/ImageUseCase';
import { SbImageRepository } from '@/backend/images/infrastructures/repositories/SbImageRepository';
import { SbUserRepository } from '@/backend/users/user/infrastructures/repositories/SbUserRepository';
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
    const file = formData.get('file');
    
    console.log('[API] FormData 내용:', {
      hasFile: !!file,
      fileType: file?.constructor.name,
      fileName: file instanceof File ? file.name : 'Not a File'
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

    const uploadUseCase = new UploadImageUseCase(new SbImageRepository());
    const result = await uploadUseCase.execute(
      requestData.file,
      bucketName,
      authResult.userId
    );

    if (!result) {
      console.error('[API] 이미지 업로드 실패');
      return createErrorResponse('이미지 업로드에 실패했습니다.', 500);
    }

    console.log('[API] 이미지 업로드 성공:', result.url);
    return NextResponse.json(result);
  } catch (error: unknown) {
    // 에러 타입 검증
    if (error instanceof Error) {
      console.error('[API] 이미지 업로드 중 오류 발생:', error.message);
    } else {
      console.error('[API] 이미지 업로드 중 예상치 못한 오류:', error);
    }
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
    // 에러 타입 검증
    if (error instanceof Error) {
      console.error('[API] 이미지 조회 중 오류 발생:', error.message);
    } else {
      console.error('[API] 이미지 조회 중 예상치 못한 오류:', error);
    }
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
    const requestData: DeleteImageRequestDto = {
      url: searchParams.get('url') || '',
      bucketName: searchParams.get('bucketName') || '',
    };
    console.log(requestData)
    if (!requestData.url || !requestData.bucketName) {
      console.error('[API] 필수 파라미터 누락');
      return NextResponse.json(
        { error: '이미지 URL과 버킷명이 필요합니다.' },
        { status: 400 }
      );
    }

    console.log(
      `[API] 이미지 삭제 시작 - URL: ${requestData.url}, 버킷: ${requestData.bucketName}`
    );

    const deleteUseCase = new DeleteImageUseCase(new SbImageRepository());
    const success = await deleteUseCase.execute(requestData.url, requestData.bucketName);

    if (!success) {
      console.error('[API] 이미지 삭제 실패');
      return NextResponse.json(
        { error: '이미지 삭제에 실패했습니다.' },
        { status: 500 }
      );
    }

    console.log('[API] 이미지 삭제 성공');
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    // 에러 타입 검증
    if (error instanceof Error) {
      console.error('[API] 이미지 삭제 중 오류 발생:', error.message);
    } else {
      console.error('[API] 이미지 삭제 중 예상치 못한 오류:', error);
    }
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
