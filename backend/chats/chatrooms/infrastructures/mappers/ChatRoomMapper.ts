// ===== 타입 정의 =====
// help_applicants 테이블과 helps 테이블을 조인한 결과의 타입
export interface HelpApplicantRow {
  help_id: number;        // 헬프 신청 ID
  junior_id: number;      // 주니어 사용자 ID
  is_accepted: boolean;   // 수락 여부
  helps: {                // 조인된 helps 테이블 데이터
    id: number;           // 헬프 ID
    senior_id: number;    // 시니어 사용자 ID
    created_at: string;   // 생성일
  }[];
}

// ===== ChatRoom 매핑 클래스 =====
// Supabase 쿼리 결과를 ChatRoom 엔티티로 변환하는 매퍼
export class ChatRoomMapper {
  
  // ===== 단일 HelpApplicantRow를 ChatRoom으로 변환 =====
  static toChatRoom(row: HelpApplicantRow) {
    return {
      chatRoomId: row.help_id,                // 헬프 ID를 임시로 chatRoomId로 사용
      helpId: row.help_id,                    // 헬프 ID
      juniorId: row.junior_id,                // 주니어 ID
      seniorId: row.helps[0].senior_id,       // 시니어 ID (조인 결과는 배열이므로 첫 번째 요소)
      createdAt: row.helps[0].created_at,     // 생성일 (조인 결과는 배열이므로 첫 번째 요소)
    };
  }

  // ===== HelpApplicantRow 배열을 ChatRoom 배열로 변환 =====
  static toChatRooms(rows: HelpApplicantRow[]) {
    return rows.map(row => this.toChatRoom(row));
  }
} 