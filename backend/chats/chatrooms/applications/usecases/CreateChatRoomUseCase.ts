import { IChatRoomRepository } from '@/backend/chats/chatrooms/domains/repositories/IChatRoomRepository';
import { ChatRoom } from '@/backend/chats/chatrooms/domains/entities/ChatRoom';

export interface CreateChatRoomRequestDto {
  juniorId: number;
  seniorId: number;
  helpId?: number;
}

export class CreateChatRoomUseCase {
  constructor(private chatRoomRepo: IChatRoomRepository) {}

  // 시니어-주니어 연결 시 채팅방 생성 (기존 채팅방이 있으면 반환, 없으면 생성)
  async execute(request: CreateChatRoomRequestDto): Promise<ChatRoom> {
    // 1. 기존 채팅방이 있는지 확인
    const existingRoom = await this.chatRoomRepo.findRoomByParticipants(
      request.juniorId, 
      request.seniorId
    );

    // 2. 기존 채팅방이 있으면 반환
    if (existingRoom) {
      return existingRoom;
    }

    // 3. 기존 채팅방이 없으면 새로 생성
    const newRoom = await this.chatRoomRepo.createRoom({
      helpId: request.helpId,
      juniorId: request.juniorId,
      seniorId: request.seniorId
    });

    return newRoom;
  }
} 