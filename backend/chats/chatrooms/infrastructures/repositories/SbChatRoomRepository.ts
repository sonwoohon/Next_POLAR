// ===== 외부 라이브러리 및 인터페이스 import =====
import { supabase } from '@/backend/common/utils/supabaseClient';
import { IChatRoomRepository } from '@/backend/chats/chatrooms/domains/repositories/IChatRoomRepository';
import { ChatRoom } from '@/backend/chats/chatrooms/domains/entities/ChatRoom';
import { getNicknameByUuid, getUuidByNickname } from '@/lib/getUserData';

// ===== Repository 구현체 =====
// IChatRoomRepository 인터페이스를 구현하는 실제 데이터베이스 접근 클래스
export class SbChatRoomRepository implements IChatRoomRepository {
  // ===== 사용자 ID로 참여한 모든 채팅방 조회 =====
  async findRoomsByUserId(userId: string): Promise<ChatRoom[]> {
    const { data, error } = await supabase
      .from('contact_rooms')
      .select('*')
      .or(`junior_id.eq.${userId},senior_id.eq.${userId}`);

    if (error) throw error;

    // UUID를 nickname으로 변환하여 ChatRoom 객체 생성
    const chatRooms: ChatRoom[] = [];
    for (const row of data ?? []) {
      const juniorNickname = await getNicknameByUuid(row.junior_id);
      const seniorNickname = await getNicknameByUuid(row.senior_id);

      chatRooms.push({
        chatRoomId: row.id,
        helpId: row.help_id,
        juniorNickname: juniorNickname || '알 수 없음',
        seniorNickname: seniorNickname || '알 수 없음',
        createdAt: row.created_at,
      });
    }

    return chatRooms;
  }

  // ===== chatRoomId로 특정 채팅방 조회 =====
  async findRoomByChatRoomId(chatRoomId: number): Promise<ChatRoom | null> {
    const { data, error } = await supabase
      .from('contact_rooms')
      .select('*')
      .eq('id', chatRoomId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // 결과가 없는 경우
        return null;
      }
      throw error;
    }

    if (!data) return null;

    // UUID를 nickname으로 변환
    const juniorNickname = await getNicknameByUuid(data.junior_id);
    const seniorNickname = await getNicknameByUuid(data.senior_id);

    return {
      chatRoomId: data.id,
      helpId: data.help_id,
      juniorNickname: juniorNickname || '알 수 없음',
      seniorNickname: seniorNickname || '알 수 없음',
      createdAt: data.created_at,
    };
  }

  // ===== chatRoomId로 특정 채팅방 조회 (nickname 포함) =====
  async findRoomWithNicknamesByChatRoomId(
    chatRoomId: number
  ): Promise<ChatRoom | null> {
    const { data, error } = await supabase
      .from('contact_rooms')
      .select('*')
      .eq('id', chatRoomId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // 결과가 없는 경우
        return null;
      }
      throw error;
    }

    if (!data) return null;

    // UUID를 nickname으로 변환
    const juniorNickname = await getNicknameByUuid(data.junior_id);
    const seniorNickname = await getNicknameByUuid(data.senior_id);

    return {
      chatRoomId: data.id,
      helpId: data.help_id,
      juniorNickname: juniorNickname || '알 수 없음',
      seniorNickname: seniorNickname || '알 수 없음',
      createdAt: data.created_at,
    };
  }

  // ===== chatRoomId로 연결된 helpId 목록 조회 =====
  async findHelpIdsByChatRoomId(chatRoomId: number): Promise<number[]> {
    const { data, error } = await supabase
      .from('contact_room_helps')
      .select('help_id')
      .eq('contact_room_id', chatRoomId);

    if (error) throw error;
    if (!data) return [];
    return data.map((row: { help_id: number }) => row.help_id);
  }

  // ===== nickname이 특정 채팅방에 접근 권한이 있는지 확인 =====
  async checkUserAccessToChatRoom(
    nickname: string,
    chatRoomId: number
  ): Promise<boolean> {
    try {
      // 1. nickname을 UUID로 변환
      const userId = await getUuidByNickname(nickname);
      if (!userId) {
        return false;
      }

      // 2. 채팅방 정보 조회
      const { data, error } = await supabase
        .from('contact_rooms')
        .select('junior_id, senior_id')
        .eq('id', chatRoomId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // 채팅방이 존재하지 않는 경우
          return false;
        }
        throw error;
      }

      if (!data) return false;

      // 3. 사용자가 해당 채팅방의 참여자인지 확인
      const isParticipant =
        data.junior_id === userId || data.senior_id === userId;
      return isParticipant;
    } catch (error) {
      console.error('checkUserAccessToChatRoom error:', error);
      return false;
    }
  }
}
