import { NextRequest, NextResponse } from 'next/server';
import { SeniorHelpCompletionUseCase } from '@/backend/seniors/helps/applications/usecases/SeniorHelpCompletionUseCase';
import { HelpStatusRepository } from '@/backend/helps/infrastructures/repositories/SbHelpStatusRepository';

// 시니어 Help 완료 요청 API
const seniorHelpCompletionUseCase = new SeniorHelpCompletionUseCase(
  new HelpStatusRepository()
);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const helpId = parseInt(id);
    if (isNaN(helpId)) {
      return NextResponse.json(
        { error: '유효하지 않은 Help ID입니다.' },
        { status: 400 }
      );
    }

    // 시니어: 완료 요청 (임시 인증 코드 생성)
    const verificationCode =
      await seniorHelpCompletionUseCase.requestCompletion(helpId);

    return NextResponse.json({
      success: true,
      verificationCode,
      message: '임시 인증 코드가 생성되었습니다. (10분 후 만료)',
    });
  } catch (error) {
    console.error('시니어 Help 완료 요청 오류:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '알 수 없는 오류' },
      { status: 500 }
    );
  }
}
