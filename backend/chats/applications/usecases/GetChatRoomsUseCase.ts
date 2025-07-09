import { IChatRoomRepository } from '../../domains/repositories/IChatRoomRepository';

export class GetChatRoomsUseCase {
  constructor(private chatRoomRepo: IChatRoomRepository) {}

  // userId가 참여한 모든 대화방 리스트 반환
  async execute(userId: number) {
    return this.chatRoomRepo.findRoomsByUserId(userId);
  }
} 