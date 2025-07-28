import { NextRequest, NextResponse } from 'next/server';
import {
  GetHelpImagesUseCase,
  UploadHelpImagesUseCase,
  DeleteAllHelpImagesUseCase,
} from '@/backend/images/applications/usecases/HelpImageUseCase';
import { SbHelpImageRepository } from '@/backend/images/infrastructures/repositories/SbHelpImageRepository';
import { SbImageRepository } from '@/backend/images/infrastructures/repositories/SbImageRepository';

// 헬프 이미지 리스트 조회 (GET)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ helpId: string }> }
): Promise<NextResponse<{ images: string[] } | { error: string }>> {
  const { helpId: helpIdParam } = await params;

  try {
    const helpId = parseInt(helpIdParam);

    if (!helpId || isNaN(helpId)) {
      return NextResponse.json(
        { error: '유효한 헬프 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const helpImageRepository = new SbHelpImageRepository();
    const getHelpImagesUseCase = new GetHelpImagesUseCase(helpImageRepository);

    const result = await getHelpImagesUseCase.execute(helpId);

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error('[API] 헬프 이미지 리스트 조회 중 오류 발생:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 헬프 이미지 업로드 (POST)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ helpId: string }> }
): Promise<NextResponse<{ urls: string[] } | { error: string }>> {
  const { helpId: helpIdParam } = await params;

  try {
    const helpId = parseInt(helpIdParam);

    if (!helpId || isNaN(helpId)) {
      return NextResponse.json(
        { error: '유효한 헬프 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const formData = await request.formData();

    // 여러 가능한 파일 필드명을 시도
    const possibleFileKeys = ['file', 'image', 'upload', 'photo', 'helpImage'];
    const files: File[] = [];

    for (const key of possibleFileKeys) {
      const value = formData.get(key);
      if (value instanceof File) {
        files.push(value);
      }
    }

    // 여러 파일을 처리하기 위해 모든 파일 필드 확인
    for (const [, value] of formData.entries()) {
      if (value instanceof File && !files.includes(value)) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      console.error('[API] 파일이 누락되었거나 유효하지 않습니다');
      return NextResponse.json(
        { error: '유효한 파일이 필요합니다.' },
        { status: 400 }
      );
    }

    const imageRepository = new SbImageRepository();
    const helpImageRepository = new SbHelpImageRepository();
    const uploadHelpImagesUseCase = new UploadHelpImagesUseCase(
      imageRepository,
      helpImageRepository
    );

    const result = await uploadHelpImagesUseCase.execute(files, helpId);

    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    console.error('[API] 헬프 이미지 업로드 중 오류 발생:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 헬프의 모든 이미지 삭제 (DELETE)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ helpId: string }> }
): Promise<NextResponse<{ success: boolean } | { error: string }>> {
  const { helpId: helpIdParam } = await params;

  try {
    const helpId = parseInt(helpIdParam);

    if (!helpId || isNaN(helpId)) {
      return NextResponse.json(
        { error: '유효한 헬프 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const helpImageRepository = new SbHelpImageRepository();
    const imageRepository = new SbImageRepository();
    const deleteAllHelpImagesUseCase = new DeleteAllHelpImagesUseCase(
      helpImageRepository,
      imageRepository
    );

    const success = await deleteAllHelpImagesUseCase.execute(helpId);

    if (success) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: '이미지 삭제에 실패했습니다.' },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('[API] 헬프의 모든 이미지 삭제 중 오류 발생:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
