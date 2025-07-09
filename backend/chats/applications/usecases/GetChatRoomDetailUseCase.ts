import { IChatRoomRepository } from '../../domains/repositories/IChatRoomRepository';

export class GetChatRoomDetailUseCase {
  constructor(private chatRoomRepo: IChatRoomRepository) {}

  // helpId로 대화방 1개 정보 반환
  async execute(helpId: number) {
    return this.chatRoomRepo.findRoomByHelpId(helpId);
  }
} 