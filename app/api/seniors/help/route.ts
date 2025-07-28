import {
  CreateSeniorHelpRequestDto,
  UpdateSeniorHelpRequestDto,
} from '@/backend/seniors/helps/applications/dtos/SeniorRequest';
import { SeniorHelpUseCase } from '@/backend/seniors/helps/applications/usecases/SeniorHelpUseCases';
import { SeniorHelpRepository } from '@/backend/seniors/helps/infrastructures/repositories/SeniorHelpRepositories';
import { UploadHelpImageUseCase } from '@/backend/images/applications/usecases/ImageUseCase';
import { SbImageRepository } from '@/backend/images/infrastructures/repositories/SbImageRepository';
import { NextRequest, NextResponse } from 'next/server';
import { getNicknameFromCookie } from '@/lib/jwt';

// 시니어 헬프 생성 API (FormData 처리, 트랜잭션 포함)
export async function POST(req: NextRequest) {
  // 쿠키에서 사용자 정보 가져오기
  const userData = getNicknameFromCookie(req);
  const { nickname } = userData || {};

  if (!nickname) {
    return NextResponse.json(
      { error: '로그인이 필요합니다.' },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();

    // FormData에서 help 데이터 추출
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const subCategoryIds = formData
      .getAll('subCategoryId')
      .map((id) => Number(id));
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;

    // 필수 필드 검증
    if (!title || !startDate || subCategoryIds.length === 0) {
      return NextResponse.json(
        {
          error:
            '필수 필드가 누락되었습니다. (title, startDate, subCategoryId)',
        },
        { status: 400 }
      );
    }

    // 이미지 파일들 추출
    const imageFiles: File[] = [];
    const imageFilesData = formData.getAll('imageFiles');
    imageFilesData.forEach((item) => {
      if (item instanceof File) {
        imageFiles.push(item);
      }
    });

    // 트랜잭션 시작: 이미지 업로드 + help 생성
    const imageRepository = new SbImageRepository();
    const uploadUseCase = new UploadHelpImageUseCase(imageRepository);
    const seniorHelpUseCase = new SeniorHelpUseCase(new SeniorHelpRepository());

    let uploadedImageUrls: string[] = [];

    try {
      // 1. 이미지 파일들 업로드
      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map(async (file) => {
          const result = await uploadUseCase.execute(file, nickname);
          return result.url;
        });
        uploadedImageUrls = await Promise.all(uploadPromises);
      }

      // 2. Help 생성
      const helpReqCreate: CreateSeniorHelpRequestDto = {
        title,
        content: content || '',
        category: subCategoryIds, // subCategoryId를 category 필드로 전달
        startDate,
        endDate,
        imageFiles: uploadedImageUrls,
      };

      const help = await seniorHelpUseCase.createHelp(nickname, helpReqCreate);

      return NextResponse.json(help, { status: 201 });
    } catch (error) {
      // 트랜잭션 실패 시 업로드된 이미지들 삭제
      console.error(
        'Help 생성 중 오류 발생, 업로드된 이미지들 삭제 중:',
        error
      );

      if (uploadedImageUrls.length > 0) {
        try {
          const deletePromises = uploadedImageUrls.map(async (url) => {
            await imageRepository.deleteImage(url, 'help-images');
          });
          await Promise.all(deletePromises);
        } catch (deleteError) {
          console.error('이미지 삭제 중 오류:', deleteError);
        }
      }

      throw error;
    }
  } catch (error) {
    console.error('Help 생성 중 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 시니어 헬프 수정 API (닉네임 기반)
export async function PUT(req: NextRequest) {
  const helpId = req.nextUrl.searchParams.get('helpId');
  const userNickname = req.nextUrl.searchParams.get('userNickname');

  if (!helpId) {
    return NextResponse.json(
      { error: 'Help ID를 입력해주세요.' },
      { status: 400 }
    );
  }

  if (!userNickname) {
    return NextResponse.json(
      { error: '사용자 닉네임이 필요합니다.' },
      { status: 400 }
    );
  }

  const helpReqUpdate: UpdateSeniorHelpRequestDto = {
    ...(await req.json()),
  };

  if (!helpReqUpdate) {
    return NextResponse.json(
      { error: '데이터를 입력해주세요.' },
      { status: 400 }
    );
  }

  try {
    const seniorHelpUseCase = new SeniorHelpUseCase(new SeniorHelpRepository());
    const help = await seniorHelpUseCase.updateHelp(
      userNickname,
      helpReqUpdate,
      Number(helpId)
    );
    return NextResponse.json(help, { status: 200 });
  } catch (error) {
    console.error('Help 수정 중 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 시니어 헬프 삭제 API (닉네임 기반)
export async function DELETE(req: NextRequest) {
  const helpId = req.nextUrl.searchParams.get('helpId');
  const userNickname = req.nextUrl.searchParams.get('userNickname');

  if (!helpId) {
    return NextResponse.json(
      { error: 'Help ID를 입력해주세요.' },
      { status: 400 }
    );
  }

  if (!userNickname) {
    return NextResponse.json(
      { error: '사용자 닉네임이 필요합니다.' },
      { status: 400 }
    );
  }

  try {
    const seniorHelpUseCase = new SeniorHelpUseCase(new SeniorHelpRepository());
    const help = await seniorHelpUseCase.deleteHelp(Number(helpId));
    return NextResponse.json(help, { status: 200 });
  } catch (error) {
    console.error('Help 삭제 중 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
