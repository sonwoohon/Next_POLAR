import { IChatRoomRepository } from '@/backend/chats/chatrooms/domains/repositories/IChatRoomRepository';
import { ChatRoom } from '@/backend/chats/chatrooms/domains/entities/ChatRoom';
import { GetChatRoomDetailRequestDto } from '@/backend/chats/chatrooms/applications/dtos/ChatRoomRequestDtos';
import { ChatRoomDetailResponseDto } from '@/backend/chats/chatrooms/applications/dtos/ChatRoomResponseDtos';
import { getNicknameByUuid } from '@/lib/getUserData';

export class GetChatRoomDetailUseCase {
  constructor(private chatRoomRepo: IChatRoomRepository) {}

  // chatRoomId로 대화방 1개 정보 반환 (닉네임 기반)
  async execute(
    request: GetChatRoomDetailRequestDto
  ): Promise<ChatRoomDetailResponseDto | null> {
    const room = await this.chatRoomRepo.findRoomByChatRoomId(
      request.chatRoomId
    );

    if (!room) {
      return null;
    }

    return await this.mapRoomToResponseDto(room);
  }

  // ChatRoom 엔티티를 응답 DTO로 매핑하는 private 메서드 (닉네임 기반)
  private async mapRoomToResponseDto(
    room: ChatRoom
  ): Promise<ChatRoomDetailResponseDto> {
    const juniorNickname = await getNicknameByUuid(room.juniorId);
    const seniorNickname = await getNicknameByUuid(room.seniorId);

    return {
      chatRoomId: room.chatRoomId,
      helpId: room.helpId,
      juniorNickname: juniorNickname || '알 수 없음',
      seniorNickname: seniorNickname || '알 수 없음',
      createdAt: room.createdAt,
      participants: {
        junior: {
          nickname: juniorNickname || '알 수 없음',
          name: '', // TODO: 사용자 정보에서 가져와야 함
          profileImgUrl: '', // TODO: 사용자 정보에서 가져와야 함
        },
        senior: {
          nickname: seniorNickname || '알 수 없음',
          name: '', // TODO: 사용자 정보에서 가져와야 함
          profileImgUrl: '', // TODO: 사용자 정보에서 가져와야 함
        },
      },
      helpInfo: {
        title: '', // TODO: 헬프 정보에서 가져와야 함
        description: '', // TODO: 헬프 정보에서 가져와야 함
        status: '', // TODO: 헬프 정보에서 가져와야 함
      },
    };
  }
}
