import { ContactMessageEntity } from '@/backend/chats/messages/domains/entities/contactMessage';
import { IContactMessageRepository } from '@/backend/chats/messages/domains/repositories/ContactMessageRepository';
import { CreateContactMessageDto } from '@/backend/chats/messages/applications/dtos/ContactMessageDtos';

export class ContactMessageUseCases {
  constructor(private readonly messageRepository: IContactMessageRepository) {}

  // 1. 채팅방별 메시지 리스트 조회
  async getMessagesByContactRoomId(contactRoomId: number): Promise<ContactMessageEntity[]> {
    return await this.messageRepository.findByContactRoomId(contactRoomId);
  }

  // 2. 메시지 생성
  async createMessage(dto: CreateContactMessageDto): Promise<ContactMessageEntity> {
    const entity = new ContactMessageEntity(
      undefined, // id (DB에서 자동 생성)
      dto.senderId,
      dto.contactRoomId,
      dto.message,
      undefined // createdAt (DB에서 자동 생성)
    );
    return await this.messageRepository.create(entity);
  }
} 