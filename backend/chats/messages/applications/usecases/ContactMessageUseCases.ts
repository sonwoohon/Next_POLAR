import { IContactMessageRepository } from '@/backend/chats/messages/domains/repositories/ContactMessageRepository';
import {
  ContactMessageRequestDto,
  GetContactMessageListResponseDto,
  GetContactMessageResponseDto,
} from '@/backend/chats/messages/applications/dtos/ContactMessageDtos';
import { ContactMessageMapper } from '../../infrastructures/mappers/ContactMessageMapper';
import { ContactMessageEntity } from '@/backend/chats/messages/domains/entities/contactMessage';

export class ContactMessageUseCases {
  constructor(private readonly messageRepository: IContactMessageRepository) {}

  // 1. 채팅방별 메시지 리스트 조회 (닉네임 기반 응답)
  async getMessagesByContactRoomId(
    contactRoomId: number
  ): Promise<GetContactMessageListResponseDto> {
    const messages = await this.messageRepository.findByContactRoomId(
      contactRoomId
    );

    // 각 메시지의 nickname 컬럼을 senderNickname으로 바로 사용
    const messagesWithNicknames = messages.map(
      (message: ContactMessageEntity) => {
        return ContactMessageMapper.toResponseDto(message);
      }
    );

    return {
      messages: messagesWithNicknames,
      totalCount: messagesWithNicknames.length,
    };
  }

  // 3. 닉네임으로 메시지 생성 (API용)
  async createMessageByNickname(
    nickname: string,
    contactRoomId: number,
    message: string
  ): Promise<GetContactMessageResponseDto> {
    const entity = new ContactMessageRequestDto(
      nickname,
      contactRoomId,
      message
    );

    const createdEntity = await this.messageRepository.createChatMessage(
      entity
    );
    return ContactMessageMapper.toResponseDto(createdEntity);
  }
}
