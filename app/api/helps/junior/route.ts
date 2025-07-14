import { NextRequest, NextResponse } from 'next/server';
import {
  GetJuniorAppliedHelpListUseCase,
  ApplyHelpUseCase,
  CancelJuniorHelpUseCase,
} from '@/backend/helps/juniors/applications/usecases/JuniorHelpUseCase';
import { SbJuniorHelpRepository } from '@/backend/helps/juniors/infrastructures/repositories/SbJuniorHelpRepository';
import { getNicknameFromCookie } from '@/lib/jwt';

// 의존성 주입을 위한 UseCase 인스턴스 생성
const createGetJuniorAppliedHelpListUseCase = () => {
  const repository = new SbJuniorHelpRepository();
  return new GetJuniorAppliedHelpListUseCase(repository);
};

const createApplyHelpUseCase = () => {
  const repository = new SbJuniorHelpRepository();
  return new ApplyHelpUseCase(repository);
};

const createCancelJuniorHelpUseCase = () => {
  const repository = new SbJuniorHelpRepository();
  return new CancelJuniorHelpUseCase(repository);
};

// 주니어 지원 헬프 리스트 조회 (닉네임 기반)
export async function GET(request: NextRequest) {
  const nickname = getNicknameFromCookie(request);

  if (!nickname) {
    return NextResponse.json(
      { success: false, error: '로그인이 필요합니다.' },
      { status: 401 }
    );
  }

  try {
    const result = await createGetJuniorAppliedHelpListUseCase().execute(
      nickname
    );
    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    console.error('주니어 헬프 리스트 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '헬프 리스트 조회 실패' },
      { status: 500 }
    );
  }
}

// 헬프 지원(신청) API (닉네임 기반)
export async function POST(request: NextRequest) {
  const nickname = getNicknameFromCookie(request);

  if (!nickname) {
    return NextResponse.json(
      { success: false, error: '로그인이 필요합니다.' },
      { status: 401 }
    );
  }

  try {
    const { helpId } = await request.json();

    if (!helpId) {
      return NextResponse.json(
        { success: false, error: 'helpId가 필요합니다.' },
        { status: 400 }
      );
    }

    const useCase = createApplyHelpUseCase();
    await useCase.execute(nickname, helpId);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('헬프 지원 오류:', error);
    return NextResponse.json(
      { success: false, error: '헬프 지원 실패' },
      { status: 500 }
    );
  }
}

// 헬프 지원 취소 API (닉네임 기반)
export async function DELETE(request: NextRequest) {
  const nickname = getNicknameFromCookie(request);

  if (!nickname) {
    return NextResponse.json(
      { success: false, error: '로그인이 필요합니다.' },
      { status: 401 }
    );
  }

  try {
    const { helpId } = await request.json();

    if (!helpId) {
      return NextResponse.json(
        { success: false, error: 'helpId가 필요합니다.' },
        { status: 400 }
      );
    }

    const useCase = createCancelJuniorHelpUseCase();
    await useCase.execute(nickname, helpId);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('헬프 지원 취소 오류:', error);
    return NextResponse.json(
      { success: false, error: '헬프 지원 취소 실패' },
      { status: 500 }
    );
  }
}
