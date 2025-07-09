import { ContactMessageEntity } from '@/backend/chats/messages/domains/entities/contactMessage';

export class ContactMessageMapper {
  static toEntity(row: any): ContactMessageEntity {
    return new ContactMessageEntity(
      row.id,
      row.sender_id,
      row.contact_room_id,
      row.message,
      new Date(row.created_at)
    );
  }
} 