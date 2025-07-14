import { supabase } from '@/backend/common/utils/supabaseClient';
import { ContactMessageEntity } from '@/backend/chats/messages/domains/entities/contactMessage';
import { IContactMessageRepository } from '@/backend/chats/messages/domains/repositories/ContactMessageRepository';
import { ContactMessageMapper } from '@/backend/chats/messages/infrastructures/mappers/ContactMessageMapper';
import { ContactMessageUseCase } from '@/backend/chats/messages/applications/dtos/ContactMessageDtos';

export class SbContactMessageRepository implements IContactMessageRepository {
  // 메시지 저장
  async create(
    requestDto: ContactMessageUseCase
  ): Promise<ContactMessageEntity> {
    console.log('[Repository] 메시지 생성 시작:', {
      senderId: requestDto.sender_id,
      contactRoomId: requestDto.contact_room_id,
      message: requestDto.message,
    });

    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        sender_id: requestDto.sender_id,
        contact_room_id: requestDto.contact_room_id,
        message: requestDto.message,
      })
      .select()
      .single();

    if (error) {
      console.error('[Repository] 메시지 생성 오류:', error);
      throw error;
    }

    if (!data) {
      console.error('[Repository] 메시지 생성 실패 - 데이터 없음');
      throw new Error('메시지 생성 실패');
    }

    console.log('[Repository] 메시지 생성 성공:', {
      id: data.id,
      senderId: data.sender_id,
      contactRoomId: data.contact_room_id,
      message: data.message,
      createdAt: data.created_at,
    });

    console.log(
      '[Repository] Supabase Realtime 이벤트 발생 예상 - contact_messages 테이블 INSERT'
    );
    console.log('[Repository] 구독자들이 이 이벤트를 받아야 함');

    return ContactMessageMapper.toEntity(data);
  }

  // 메시지 리스트 조회
  async findByContactRoomId(
    contactRoomId: number
  ): Promise<ContactMessageEntity[]> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('contact_room_id', contactRoomId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    if (!data) return [];

    return data.map(
      (row: {
        id: number;
        contact_room_id: number;
        sender_id: string; // UUID
        message: string;
        created_at: string;
      }) => ContactMessageMapper.toEntity(row)
    );
  }
}
