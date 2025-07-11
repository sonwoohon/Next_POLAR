// ===== 외부 라이브러리 및 인터페이스 import =====
import { supabase } from '@/backend/common/utils/supabaseClient';
import { IChatRoomRepository } from '@/backend/chats/chatrooms/domains/repositories/IChatRoomRepository';
import { ChatRoom } from '@/backend/chats/chatrooms/domains/entities/ChatRoom';
import { ChatRoomMapper } from '@/backend/chats/chatrooms/infrastructures/mappers/ChatRoomMapper';

// ===== Repository 구현체 =====
// IChatRoomRepository 인터페이스를 구현하는 실제 데이터베이스 접근 클래스
export class SbChatRoomRepository implements IChatRoomRepository {
  // ===== 사용자 ID로 참여한 모든 채팅방 조회 =====
  async findRoomsByUserId(userId: number): Promise<ChatRoom[]> {
    const { data, error } = await supabase
      .from('contact_rooms')
      .select('*')
      .or(`junior_id.eq.${userId},senior_id.eq.${userId}`);

    if (error) throw error;
    return ChatRoomMapper.toChatRooms(data ?? []);
  }

  // ===== chatRoomId로 특정 채팅방 상세 정보 조회 =====
  async findRoomByChatRoomId(chatRoomId: number): Promise<ChatRoom | null> {
    const { data, error } = await supabase
      .from('contact_rooms')
      .select('*')
      .eq('id', chatRoomId)
      .single();

    if (error || !data) return null;
    return ChatRoomMapper.toChatRoom(data);
  }

  // ===== 시니어-주니어 조합으로 기존 채팅방 조회 =====
  async findRoomByParticipants(juniorId: number, seniorId: number): Promise<ChatRoom | null> {
    const { data, error } = await supabase
      .from('contact_rooms')
      .select('*')
      .eq('junior_id', juniorId)
      .eq('senior_id', seniorId)
      .single();

    if (error || !data) return null;
    return ChatRoomMapper.toChatRoom(data);
  }

  // ===== chatRoomId로 연결된 helpId 목록 조회 =====
  async findHelpIdsByChatRoomId(chatRoomId: number): Promise<number[]> {
    const { data, error } = await supabase
      .from('contact_room_helps')
      .select('help_id')
      .eq('room_id', chatRoomId); // 컬럼명을 room_id로 수정

    if (error) throw error;
    if (!data) return [];
    // data는 [{ help_id: 1 }, { help_id: 2 }, ...] 형태
    return data.map((row: { help_id: number }) => row.help_id);
  }
} 