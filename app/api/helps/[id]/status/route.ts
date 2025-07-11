import { NextRequest, NextResponse } from 'next/server';
import { HelpStatus } from '@/backend/helps/domains/entities/HelpStatus';
import { CommonHelpStatusUseCase } from '@/backend/helps/applications/usecases/CommonHelpStatusUseCases';
import { HelpStatusRepository } from '@/backend/helps/infrastructures/repositories/SbHelpStatusRepository';

// 공통 Help 상태 관리 API
const commonHelpStatusUseCase = new CommonHelpStatusUseCase(
  new HelpStatusRepository()
);

// Help 상태 조회
export async function GET(
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

    const status = await commonHelpStatusUseCase.getHelpStatus(helpId);

    if (!status) {
      return NextResponse.json(
        { error: 'Help를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ status });
  } catch (error) {
    console.error('Help 상태 조회 오류:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '알 수 없는 오류' },
      { status: 500 }
    );
  }
}

// Help 상태 변경 (모든 상태 지원)
export async function PATCH(
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

    const { status } = await request.json();

    if (!status || !Object.values(HelpStatus).includes(status)) {
      return NextResponse.json(
        { error: '유효하지 않은 상태입니다.' },
        { status: 400 }
      );
    }

    const success = await commonHelpStatusUseCase.updateHelpStatus(
      helpId,
      status
    );

    return NextResponse.json({
      status: success ? 200 : 500,
      message: success
        ? `Help 상태가 성공적으로 ${status}로 변경되었습니다.`
        : 'Help 상태 변경에 실패했습니다.',
    });
  } catch (error) {
    console.error('Help 상태 변경 오류:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '알 수 없는 오류' },
      { status: 500 }
    );
  }
}
