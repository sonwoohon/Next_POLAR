import { NextResponse } from 'next/server';
import {
  GetJuniorAppliedHelpListUseCase,
  ApplyHelpUseCase,
  CancelJuniorHelpUseCase,
} from '@/backend/helps/juniors/applications/usecases/JuniorHelpUseCase';
import { SbJuniorHelpRepository } from '@/backend/helps/juniors/infrastructures/repositories/SbJuniorHelpRepository';
// import { HelpDetailResponseDto } from "@/backend/helps/applications/dtos/HelpDTO";

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('juniorId');

  const result = await createGetJuniorAppliedHelpListUseCase().execute(
    Number(userId)
  );

  if (!userId) {
    return new NextResponse(
      JSON.stringify({ success: false, error: 'userId가 필요합니다.' }),
      { status: 400 }
    );
  }

  // userId를 사용해서 로직 처리

  return new NextResponse(JSON.stringify({ success: true, result }), {
    status: 200,
  });
}

// 지원(신청) API
export async function POST(request: Request) {
  const { juniorId, helpId } = await request.json();
  const useCase = createApplyHelpUseCase();
  try {
    await useCase.execute(juniorId, helpId);
    return new NextResponse(JSON.stringify({ success: true }), { status: 201 });
  } catch {
    return new NextResponse(
      JSON.stringify({ success: false, error: '헬프 지원 실패' }),
      { status: 500 }
    );
  }
}

// 지원 취소 API
export async function DELETE(request: Request) {
  const { juniorId, helpId } = await request.json();
  const useCase = createCancelJuniorHelpUseCase();
  try {
    await useCase.execute(juniorId, helpId);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: '헬프 지원 취소 실패' }),
      { status: 500 }
    );
  }
}
