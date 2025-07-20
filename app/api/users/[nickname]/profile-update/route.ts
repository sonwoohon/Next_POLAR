import { NextRequest, NextResponse } from 'next/server';
import { getUuidByNickname } from '@/lib/getUserData';
import {
  ProfileUpdateUseCase,
  ProfileImageUpdateUseCase,
} from '@/backend/users/profile-update/applications/usecases/ProfileUpdateUseCase';
import { SbProfileUpdateRepository } from '@/backend/users/profile-update/infrastructures/repositories/SbProfileUpdateRepository';

// 의존성 주입을 위한 UseCase 인스턴스 생성
const createProfileUpdateUseCase = () => {
  const repository = new SbProfileUpdateRepository();
  return new ProfileUpdateUseCase(repository);
};

const createProfileImageUpdateUseCase = () => {
  const repository = new SbProfileUpdateRepository();
  return new ProfileImageUpdateUseCase(repository);
};



// 프로필 정보 업데이트 API
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ nickname: string }> }
) {
  try {
    const { nickname } = await params;

    if (!nickname || nickname.trim() === '') {
      return NextResponse.json({ error: 'nickname이 필요합니다.' }, { status: 400 });
    }

    // 닉네임을 userId로 변환
    const userId = await getUuidByNickname(nickname);
    if (!userId) {
      return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 요청 본문 파싱
    const body = await request.json();
    const { name, address } = body;

    // 업데이트할 데이터 검증
    const updateData: Partial<{
      name: string;
      address: string;
    }> = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        return NextResponse.json({ error: '이름은 비어있을 수 없습니다.' }, { status: 400 });
      }
      updateData.name = name.trim();
    }

    if (address !== undefined) {
      if (typeof address !== 'string' || address.trim() === '') {
        return NextResponse.json({ error: '주소는 비어있을 수 없습니다.' }, { status: 400 });
      }
      updateData.address = address.trim();
    }

    // 업데이트할 데이터가 없는 경우
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: '업데이트할 데이터가 없습니다.' }, { status: 400 });
    }

    const useCase = createProfileUpdateUseCase();
    const updatedUser = await useCase.execute(userId, updateData);

    if (!updatedUser) {
      return NextResponse.json({ error: '프로필 업데이트에 실패했습니다.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: '프로필이 성공적으로 업데이트되었습니다.',
      data: updatedUser
    }, { status: 200 });
  } catch (error) {
    console.error('[API] 프로필 업데이트 중 오류 발생:', error);
    return NextResponse.json(
      { error: '프로필 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 프로필 이미지 업데이트 API
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ nickname: string }> }
) {
  try {
    const { nickname } = await params;

    if (!nickname || nickname.trim() === '') {
      return NextResponse.json({ error: 'nickname이 필요합니다.' }, { status: 400 });
    }

    // 닉네임을 userId로 변환
    const userId = await getUuidByNickname(nickname);
    if (!userId) {
      return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
    }

    // FormData 파싱
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json({ error: '이미지 파일이 필요합니다.' }, { status: 400 });
    }

    const useCase = createProfileImageUpdateUseCase();
    const result = await useCase.execute(userId, imageFile);

    if (!result) {
      return NextResponse.json({ error: '프로필 이미지 업데이트에 실패했습니다.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: '프로필 이미지가 성공적으로 업데이트되었습니다.',
      data: { profileImgUrl: result.profileImgUrl }
    }, { status: 200 });
  } catch (error) {
    console.error('[API] 프로필 이미지 업데이트 중 오류 발생:', error);
    return NextResponse.json(
      { error: '프로필 이미지 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 