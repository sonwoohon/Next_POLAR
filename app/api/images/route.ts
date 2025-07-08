import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromCookie } from '@/lib/jwt';
import { UploadImageUseCase, GetImageByUrlUseCase, DeleteImageUseCase } from '@/backend/images/applications/usecases/ImageUseCase';
import { SbImageRepository } from '@/backend/images/infrastructures/repositories/SbImageRepository';
import { SbUserRepository } from '@/backend/uesrs/infrastructures/repositories/SbUserRepository';
import { CommonUserEntity } from '@/backend/uesrs/domains/entities/CommonUserEntity';

// 이미지 업로드 (POST)
export async function POST(request: NextRequest) {
  console.log('[API] 이미지 업로드 요청 시작');
  
  try {
    // 쿠키에서 userId 추출
    const userId = getUserIdFromCookie(request);
    if (!userId) {
      return NextResponse.json(
        { error: '유효하지 않은 사용자 ID입니다.' },
        { status: 400 }
      );
    }

    // FormData에서 파일 추출
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: '업로드할 이미지 파일이 없습니다.' },
        { status: 400 }
      );
    }

    // 버킷명 설정 (프로필 이미지용)
    const bucketName = 'profile-images';

    // 유저 조회
    const userRepository = new SbUserRepository();
    const user = await userRepository.getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 기존 프로필 이미지가 있으면 삭제
    if (user.profileImgUrl && user.profileImgUrl.trim() !== '') {
      const imageRepository = new SbImageRepository();
      const deleteImageUseCase = new DeleteImageUseCase(imageRepository);
      await deleteImageUseCase.execute(user.profileImgUrl, bucketName);
    }

    // 새 이미지 업로드
    const imageRepository = new SbImageRepository();
    const uploadUseCase = new UploadImageUseCase(imageRepository);
    const imageUrl = await uploadUseCase.execute(file, bucketName, userId);

    // 업로드된 이미지 URL을 user 테이블에 업데이트
    const updatedUser = new CommonUserEntity(
      user.id,
      user.phoneNumber,
      user.password,
      user.email,
      user.age,
      imageUrl.url, // 프로필 이미지 URL 업데이트
      user.address,
      user.name,
      user.createdAt
    );
    await userRepository.updateUser(userId, updatedUser);

    console.log('[API] 이미지 업로드 및 프로필 이미지 업데이트 성공');
    return NextResponse.json({
      success: true,
      message: '이미지가 성공적으로 업로드되고 프로필 이미지가 업데이트되었습니다.',
      image: imageUrl
    });

  } catch (error: any) {
    console.error('[API] 이미지 업로드 중 오류 발생:', error);
    return NextResponse.json(
      { error: '이미지 업로드에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 이미지 조회 (GET)
export async function GET(request: NextRequest) {
  console.log('[API] 프로필 이미지 URL 조회 요청 시작');
  try {
    // 쿠키에서 userId 추출
    const userId = getUserIdFromCookie(request);
    if (!userId) {
      return NextResponse.json(
        { error: '유효하지 않은 사용자 ID입니다.' },
        { status: 400 }
      );
    }

    // 사용자 조회
    const userRepository = new SbUserRepository();
    const user = await userRepository.getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 프로필 이미지가 있는 경우에만 이미지 조회 UseCase 실행
    if (user.profileImgUrl && user.profileImgUrl.trim() !== '') {
      const imageRepository = new SbImageRepository();
      const getImageUseCase = new GetImageByUrlUseCase(imageRepository);
      
      try {
        const imageInfo = await getImageUseCase.execute(user.profileImgUrl, 'profile-images');
        if (imageInfo) {
          return NextResponse.json({
            success: true,
            message: '프로필 이미지를 성공적으로 조회했습니다.',
            image: imageInfo
          });
        }
      } catch (error) {
        console.warn('[API] 이미지 조회 실패, 기본 URL 반환:', error);
      }
    }

    // 이미지가 없거나 조회 실패 시 기본 URL 반환
    return NextResponse.json({
      success: true,
      message: '프로필 이미지 URL을 성공적으로 조회했습니다.',
      image: { url: user.profileImgUrl || '' }
    });
  } catch (error: any) {
    console.error('[API] 프로필 이미지 URL 조회 중 오류 발생:', error);
    return NextResponse.json(
      { error: '프로필 이미지 URL 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 이미지 삭제 (DELETE)
export async function DELETE(request: NextRequest) {
  console.log('[API] 이미지 삭제 요청 시작');
  
  try {
    // 쿠키에서 userId 추출
    const userId = getUserIdFromCookie(request);
    if (!userId) {
      console.error('[API] 유효하지 않은 사용자 ID입니다.');
      return NextResponse.json(
        { error: '유효하지 않은 사용자 ID입니다.' },
        { status: 400 }
      );
    }

    // 사용자 조회
    const userRepository = new SbUserRepository();
    const user = await userRepository.getUserById(userId);
    if (!user) {
      console.error('[API] 사용자를 찾을 수 없습니다.');
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 프로필 이미지 URL이 있는지 확인
    if (!user.profileImgUrl || user.profileImgUrl.trim() === '') {
      console.log('[API] 삭제할 프로필 이미지가 없습니다.');
      return NextResponse.json({
        success: true,
        message: '삭제할 프로필 이미지가 없습니다.'
      });
    }

    // 이미지 삭제 UseCase 실행
    const imageRepository = new SbImageRepository();
    const deleteImageUseCase = new DeleteImageUseCase(imageRepository);
    
    const deleteSuccess = await deleteImageUseCase.execute(user.profileImgUrl, 'profile-images');
    if (!deleteSuccess) {
      console.error('[API] 이미지 파일 삭제에 실패했습니다.');
      return NextResponse.json(
        { error: '이미지 파일 삭제에 실패했습니다.' },
        { status: 500 }
      );
    }

    console.log('[API] Supabase Storage 이미지 삭제 성공');

    // 유저 테이블의 profileImgUrl을 빈 문자열로 업데이트
    const updatedUser = new CommonUserEntity(
      user.id,
      user.phoneNumber,
      user.password,
      user.email,
      user.age,
      '', // 빈 문자열로 설정
      user.address,
      user.name,
      user.createdAt
    );

    const updateResult = await userRepository.updateUser(userId, updatedUser);
    if (!updateResult) {
      console.error('[API] 유저 테이블 업데이트 실패');
      return NextResponse.json(
        { error: '유저 정보 업데이트에 실패했습니다.' },
        { status: 500 }
      );
    }

    console.log('[API] 이미지 삭제 및 유저 정보 업데이트 성공');
    return NextResponse.json({
      success: true,
      message: '프로필 이미지가 성공적으로 삭제되었습니다.',
      user: updateResult.toJSON()
    });

  } catch (error: any) {
    console.error('[API] 이미지 삭제 중 오류 발생:', error);
    return NextResponse.json(
      { error: '이미지 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
} 