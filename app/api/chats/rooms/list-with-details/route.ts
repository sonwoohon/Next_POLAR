import { NextRequest, NextResponse } from 'next/server';
import { GetChatRoomsUseCase } from '@/backend/chats/chatrooms/applications/usecases/GetChatRoomsUseCase';
import { SbChatRoomRepository } from '@/backend/chats/chatrooms/infrastructures/repositories/SbChatRoomRepository';
import { SbCommonHelpRepository } from '@/backend/helps/infrastructures/repositories/SbCommonHelpRepository';
import { SbHelpImageRepository } from '@/backend/images/infrastructures/repositories/SbHelpImageRepository';
import { getNicknameFromCookie } from '@/lib/jwt';
import { getSeniorInfoByUuid, getUuidByNickname } from '@/lib/getUserData';

interface ChatRoomWithDetails {
  chatRoomId: number;
  helpId?: number;
  juniorNickname: string;
  seniorNickname: string;
  createdAt: string;
  opponentProfile: {
    nickname: string;
    name: string;
    profileImgUrl: string;
  };
  latestHelp?: {
    id: number;
    title: string;
    category: { id: number; point: number }[];
    representativeImage: string;
  };
}

interface ChatRoomListWithDetailsResponse {
  rooms: ChatRoomWithDetails[];
  totalCount: number;
}

export async function GET(req: NextRequest) {
  try {
    const userData = getNicknameFromCookie(req);
    const { nickname } = userData || {};

    if (!nickname) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. 기본 채팅방 리스트 조회
    const usecase = new GetChatRoomsUseCase(new SbChatRoomRepository());
    const result = await usecase.execute(nickname);

    // 2. 각 채팅방에 상세 정보 추가
    const chatRoomRepository = new SbChatRoomRepository();
    const helpRepository = new SbCommonHelpRepository();
    const helpImageRepository = new SbHelpImageRepository();

    const roomsWithDetails: ChatRoomWithDetails[] = await Promise.all(
      result.rooms.map(async (room) => {
        // 3. 상대방 프로필 정보 조회
        const opponentNickname =
          room.juniorNickname === nickname
            ? room.seniorNickname
            : room.juniorNickname;

        const opponentUuid = await getUuidByNickname(opponentNickname);
        const opponentProfile = opponentUuid
          ? await getSeniorInfoByUuid(opponentUuid)
          : null;

        // 4. 최근 help 정보 조회
        const helpIds = await chatRoomRepository.findHelpIdsByChatRoomId(
          room.chatRoomId
        );
        let latestHelp = undefined;

        if (helpIds && helpIds.length > 0) {
          // 가장 최근 help 조회 (첫 번째 help)
          const help = await helpRepository.getHelpById(helpIds[0]);
          if (help) {
            const images = await helpImageRepository.getHelpImageUrlsByHelpId(
              help.id
            );
            latestHelp = {
              id: help.id,
              title: help.title,
              category: help.category,
              representativeImage: images && images.length > 0 ? images[0] : '',
            };
          }
        }

        return {
          chatRoomId: room.chatRoomId,
          helpId: room.helpId,
          juniorNickname: room.juniorNickname,
          seniorNickname: room.seniorNickname,
          createdAt: room.createdAt,
          opponentProfile: {
            nickname: opponentProfile?.nickname || opponentNickname,
            name: opponentProfile?.name || '이름 없음',
            profileImgUrl: opponentProfile?.profileImgUrl || '',
          },
          latestHelp,
        };
      })
    );

    const response: ChatRoomListWithDetailsResponse = {
      rooms: roomsWithDetails,
      totalCount: roomsWithDetails.length,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('[API] 채팅방 리스트 상세 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
