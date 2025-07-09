import { SbCommonHelpRepository } from '@/backend/helps/infrastructures/repositories/SbCommonHelpRepository';
import {
  CreateSeniorHelpRequestDto,
  UpdateSeniorHelpRequestDto,
} from '@/backend/seniors/helps/applications/dtos/SeniorRequest';
import { SeniorHelpUseCase } from '@/backend/seniors/helps/applications/usecases/SeniorHelpUseCases';
import { SeniorHelpRepository } from '@/backend/seniors/helps/infrastructures/SeniorHelpInfrastructure';
import { getUserIdFromCookie } from '@/lib/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  //   const userId = getUserIdFromCookie(req);

  //   if (!userId) {
  //     return NextResponse.json(
  //       { error: '로그인이 필요합니다.' },
  //       { status: 401 }
  //     );
  //   }

  const helpReqCreate: CreateSeniorHelpRequestDto = {
    ...(await req.json()),
  };

  if (!helpReqCreate) {
    return NextResponse.json(
      { error: '데이터를 입력해주세요.' },
      { status: 400 }
    );
  }

  try {
    const seniorHelpUseCase = new SeniorHelpUseCase(new SeniorHelpRepository());
    const help = await seniorHelpUseCase.createHelp(9, helpReqCreate);
    return NextResponse.json(help, { status: 200 });
  } catch (error) {
    console.error('점수 조회 중 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  //   const userId = await getUserIdFromCookie(req);
  const helpId = parseInt(req.nextUrl.pathname.split('/').pop() || '0');

  //   if (!userId) {
  //     return NextResponse.json(
  //       { error: '로그인이 필요합니다.' },
  //       { status: 401 }
  //     );
  //   }

  if (!helpId) {
    return NextResponse.json(
      { error: '헬프를 입력해주세요.' },
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
    const seniorHelpUseCase = new SeniorHelpUseCase(
      new SeniorHelpRepository(),
      new SbCommonHelpRepository()
    );
    const help = await seniorHelpUseCase.updateHelp(
      //   Number(userId),
      9,
      helpReqUpdate,
      Number(helpId)
    );
    return NextResponse.json(help, { status: 200 });
  } catch (error) {
    console.error('점수 조회 중 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  //   const userId = await getUserIdFromCookie(req);

  //   if (!userId) {
  //     return NextResponse.json(
  //       { error: '로그인이 필요합니다.' },
  //       { status: 401 }
  //     );
  //   }

  const helpId = parseInt(req.nextUrl.pathname.split('/').pop() || '0');

  if (!helpId) {
    return NextResponse.json(
      { error: '데이터를 입력해주세요.' },
      { status: 400 }
    );
  }

  try {
    const seniorHelpUseCase = new SeniorHelpUseCase(new SeniorHelpRepository());
    const help = await seniorHelpUseCase.deleteHelp(Number(helpId));
    return NextResponse.json(help, { status: 200 });
  } catch (error) {
    console.error('점수 조회 중 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
