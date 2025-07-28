import { NextRequest, NextResponse } from 'next/server';
import { GetContactRoomsUseCase } from '@/backend/chats/contactRooms/applications/usecases/GetContactRoomsUseCase';
import { SbContactRoomRepository } from '@/backend/chats/contactRooms/infrastructures/repositories/SbContactRoomRepository';
import { SbCommonHelpRepository } from '@/backend/helps/infrastructures/repositories/SbCommonHelpRepository';
import { SbHelpImageRepository } from '@/backend/images/infrastructures/repositories/SbHelpImageRepository';
import { SbUserRepository } from '@/backend/users/user/infrastructures/repositories/SbUserRepository';
import { getNicknameFromCookie } from '@/lib/jwt';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // 현재 사용자 정보 가져오기 (쿠키에서)
    const { nickname } = getNicknameFromCookie(request) || {};
    if (!nickname) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    // UseCase 실행
    const contactRoomRepository = new SbContactRoomRepository();
    const helpRepository = new SbCommonHelpRepository();
    const helpImageRepository = new SbHelpImageRepository();
    const userRepository = new SbUserRepository();

    const usecase = new GetContactRoomsUseCase(
      contactRoomRepository,
      helpRepository,
      helpImageRepository,
      userRepository
    );

    const result = await usecase.execute(nickname);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('채팅방 목록 조회 중 오류:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : '채팅방 목록 조회 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
