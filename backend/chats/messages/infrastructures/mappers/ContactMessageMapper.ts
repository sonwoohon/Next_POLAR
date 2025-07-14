import { ContactMessageEntity } from '@/backend/chats/messages/domains/entities/contactMessage';
import { ContactMessageResponseDto } from '../../applications/dtos/ContactMessageDtos';

export class ContactMessageMapper {
  static toEntity(row: {
    id: number;
    sender_id: string;
    contact_room_id: number;
    message: string;
    created_at: string;
  }): ContactMessageEntity {
    return new ContactMessageEntity(
      row.id,
      row.sender_id, // UUID
      row.contact_room_id,
      row.message,
      new Date(row.created_at)
    );
  }

  static toResponseDto(
    entity: ContactMessageEntity,
    senderNickname: string
  ): ContactMessageResponseDto {
    return {
      id: entity.id!,
      senderNickname: senderNickname,
      contactRoomId: entity.contactRoomId,
      message: entity.message,
      createdAt: entity.createdAt!.toISOString(),
    };
  }
}
