import { IChatRoomRepository } from '@/backend/chats/chatrooms/domains/repositories/IChatRoomRepository';
import {
  ChatRoomListResponseDto,
  ChatRoomResponseDto,
} from '@/backend/chats/chatrooms/applications/dtos/ChatRoomResponseDtos';
import { getNicknameByUuid, getUuidByNickname } from '@/lib/getUserName';

export class GetChatRoomsUseCase {
  constructor(private chatRoomRepo: IChatRoomRepository) {}

  // userId가 참여한 모든 대화방 리스트 반환 (닉네임 기반)
  async execute(nickname: string): Promise<ChatRoomListResponseDto> {
    const userId = await getUuidByNickname(nickname);
    if (!userId) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
    const rooms = await this.chatRoomRepo.findRoomsByUserId(userId);

    // 각 채팅방의 UUID를 닉네임으로 변환
    const roomDtos: ChatRoomResponseDto[] = await Promise.all(
      rooms.map(async (room) => {
        const juniorNickname = await getNicknameByUuid(room.juniorId);
        const seniorNickname = await getNicknameByUuid(room.seniorId);

        return {
          chatRoomId: room.chatRoomId,
          helpId: room.helpId,
          juniorNickname: juniorNickname || '알 수 없음',
          seniorNickname: seniorNickname || '알 수 없음',
          createdAt: room.createdAt,
        };
      })
    );

    return {
      rooms: roomDtos,
      totalCount: roomDtos.length,
    };
  }
}
