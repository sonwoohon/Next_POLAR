import { ContactMessageEntity } from '@/backend/chats/messages/domains/entities/contactMessage';

export interface IContactMessageRepository {
  // 메시지 리스트 조회 (특정 채팅방)
  findByContactRoomId(contactRoomId: number): Promise<ContactMessageEntity[]>;

  // 메시지 생성
  create(message: Omit<ContactMessageEntity, 'id' | 'createdAt'>): Promise<ContactMessageEntity>;
} 