import { IChatRoomRepository } from '@/backend/chats/chatrooms/domains/repositories/IChatRoomRepository';

export class CheckChatRoomAccessUseCase {
  constructor(private chatRoomRepo: IChatRoomRepository) {}

  async execute(nickname: string, chatRoomId: number): Promise<boolean> {
    try {
      // repository의 메서드를 사용하여 접근 권한 확인
      return await this.chatRoomRepo.checkUserAccessToChatRoom(nickname, chatRoomId);
    } catch (error) {
      console.error('CheckChatRoomAccessUseCase error:', error);
      return false;
    }
  }
} 