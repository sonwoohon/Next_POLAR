import { NextRequest, NextResponse } from 'next/server';
import { getUuidByNickname } from '@/lib/getUserData';
import { PasswordChangeUseCase } from '@/backend/users/profile-update/applications/usecases/ProfileUpdateUseCase';
import { SbProfileUpdateRepository } from '@/backend/users/profile-update/infrastructures/repositories/SbProfileUpdateRepository';

// 의존성 주입을 위한 UseCase 인스턴스 생성
const createPasswordChangeUseCase = () => {
  const repository = new SbProfileUpdateRepository();
  return new PasswordChangeUseCase(repository);
};

// 비밀번호 변경 API
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
    const { currentPassword, newPassword } = body;

    // 입력 데이터 검증
    if (!currentPassword || typeof currentPassword !== 'string') {
      return NextResponse.json({ error: '현재 비밀번호가 필요합니다.' }, { status: 400 });
    }

    if (!newPassword || typeof newPassword !== 'string') {
      return NextResponse.json({ error: '새 비밀번호가 필요합니다.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: '새 비밀번호는 최소 6자 이상이어야 합니다.' }, { status: 400 });
    }

    if (currentPassword === newPassword) {
      return NextResponse.json({ error: '새 비밀번호는 현재 비밀번호와 달라야 합니다.' }, { status: 400 });
    }

    const useCase = createPasswordChangeUseCase();
    const updatedUser = await useCase.execute(userId, currentPassword, newPassword);

    if (!updatedUser) {
      return NextResponse.json({ error: '비밀번호 변경에 실패했습니다.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: '비밀번호가 성공적으로 변경되었습니다.'
    }, { status: 200 });
  } catch (error) {
    console.error('[API] 비밀번호 변경 중 오류 발생:', error);
    return NextResponse.json(
      { error: '비밀번호 변경 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 