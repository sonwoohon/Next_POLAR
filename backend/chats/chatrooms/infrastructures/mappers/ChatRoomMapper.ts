import { ChatRoom } from '@/backend/chats/chatrooms/domains/entities/ChatRoom';

// ===== 타입 정의 =====
// contact_rooms 테이블의 타입
export interface ContactRoomRow {
  id: number; // 채팅방 ID
  senior_id: string; // 시니어 ID (UUID)
  junior_id: string; // 주니어 ID (UUID)
  created_at: string; // 생성일
}

// ===== ChatRoom 매핑 클래스 =====
// Supabase 쿼리 결과를 ChatRoom 엔티티로 변환하는 매퍼
export class ChatRoomMapper {
  // ===== 단일 ContactRoomRow를 ChatRoom으로 변환 =====
  static toChatRoom(row: ContactRoomRow): ChatRoom {
    return {
      chatRoomId: row.id,
      juniorId: row.junior_id,
      seniorId: row.senior_id,
      createdAt: row.created_at,
    };
  }

  // ===== ContactRoomRow 배열을 ChatRoom 배열로 변환 =====
  static toChatRooms(rows: ContactRoomRow[]): ChatRoom[] {
    return rows.map((row) => this.toChatRoom(row));
  }
}
