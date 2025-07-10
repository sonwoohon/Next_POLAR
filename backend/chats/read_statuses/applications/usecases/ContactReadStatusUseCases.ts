import { IContactReadStatusRepository } from '@/backend/chats/read_statuses/domains/repositories/ContactReadStatusRepository';
import { ContactReadStatusEntity } from '@/backend/chats/read_statuses/domains/entities/contactReadStatus';

export class ContactReadStatusUseCases {
  constructor(private repo: IContactReadStatusRepository) {}

  async getReadStatus(contactRoomId: number, readerId: number): Promise<ContactReadStatusEntity | null> {
    return this.repo.findByRoomAndReader(contactRoomId, readerId);
  }

  async updateReadStatus(contactRoomId: number, readerId: number, lastReadMessageId: number): Promise<ContactReadStatusEntity> {
    return this.repo.updateReadStatus(contactRoomId, readerId, lastReadMessageId);
  }
} 