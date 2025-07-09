import { ContactMessageEntity } from '@/backend/chats/messages/domains/entities/contactMessage';
import { IContactMessageRepository } from '@/backend/chats/messages/domains/repositories/ContactMessageRepository';

export class ContactMessageUseCases {
  constructor(private readonly messageRepository: IContactMessageRepository) {}

  // 1. 채팅방별 메시지 리스트 조회
  async getMessagesByContactRoomId(contactRoomId: number): Promise<ContactMessageEntity[]> {
    return await this.messageRepository.findByContactRoomId(contactRoomId);
  }

  // 2. 메시지 생성
  async createMessage(message: Omit<ContactMessageEntity, 'id' | 'createdAt'>): Promise<ContactMessageEntity> {
    return await this.messageRepository.create(message);
  }
} 