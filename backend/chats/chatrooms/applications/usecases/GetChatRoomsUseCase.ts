import { IChatRoomRepository } from '@/backend/chats/chatrooms/domains/repositories/IChatRoomRepository';
import { 
  GetUserChatRoomsRequestDto, 
  ChatRoomListResponseDto,
  ChatRoomResponseDto 
} from '@/backend/chats/chatrooms/applications/dtos/ChatRoomDtos';

export class GetChatRoomsUseCase {
  constructor(private chatRoomRepo: IChatRoomRepository) {}

  // userId가 참여한 모든 대화방 리스트 반환
  async execute(request: GetUserChatRoomsRequestDto): Promise<ChatRoomListResponseDto> {
    const rooms = await this.chatRoomRepo.findRoomsByUserId(request.userId);
    
    const roomDtos: ChatRoomResponseDto[] = rooms.map(room => ({
      helpId: room.helpId,
      juniorId: room.juniorId,
      seniorId: room.seniorId,
      createdAt: room.createdAt
    }));

    return {
      rooms: roomDtos,
      totalCount: roomDtos.length
    };
  }
} 