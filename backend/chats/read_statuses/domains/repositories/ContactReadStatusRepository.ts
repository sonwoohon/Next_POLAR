import { ContactReadStatusEntity } from '@/backend/chats/read_statuses/domains/entities/contactReadStatus';

export interface IContactReadStatusRepository {
  // 특정 방+유저의 읽음 상태 조회
  findByRoomAndReader(contactRoomId: number, readerId: number): Promise<ContactReadStatusEntity | null>;

  // 읽음 상태 upsert (없으면 insert, 있으면 update)
  upsertReadStatus(
    contactRoomId: number,
    readerId: number,
    lastReadMessageId: number
  ): Promise<ContactReadStatusEntity>;
} 