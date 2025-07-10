// ===== 외부 라이브러리 및 인터페이스 import =====
import { createClient } from '@supabase/supabase-js';
import { IChatRoomRepository } from '../domains/repositories/IChatRoomRepository';
import { ChatRoom } from '../domains/entities/ChatRoom';

// ===== Supabase 쿼리 결과를 위한 타입 정의 =====
// help_applicants 테이블과 helps 테이블을 조인한 결과의 타입
interface HelpApplicantRow {
  help_id: number;        // 헬프 신청 ID
  junior_id: number;      // 주니어 사용자 ID
  is_accepted: boolean;   // 수락 여부
  helps: {                // 조인된 helps 테이블 데이터
    id: number;           // 헬프 ID
    senior_id: number;    // 시니어 사용자 ID
    created_at: string;   // 생성일
  }[];
}

// ===== Supabase 클라이언트 초기화 =====
// 환경변수에서 URL과 API 키를 가져와서 Supabase 연결
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

// ===== Repository 구현체 =====
// IChatRoomRepository 인터페이스를 구현하는 실제 데이터베이스 접근 클래스
export class ChatRoomRepository implements IChatRoomRepository {
  
  // ===== 사용자 ID로 참여한 모든 채팅방 조회 =====
  // 1. help_applicants 테이블에서 is_accepted=true인 데이터 조회
  // 2. helps 테이블과 조인하여 시니어 정보 가져오기
  // 3. 사용자가 주니어이거나 시니어인 경우 모두 포함
  async findRoomsByUserId(userId: number): Promise<ChatRoom[]> {
    // Supabase 쿼리 실행
    const { data, error } = await supabase
      .from('help_applicants')                                    // help_applicants 테이블 선택
      .select(`help_id, junior_id, is_accepted, helps!inner(id, senior_id, created_at)`)  // helps 테이블과 조인
      .eq('is_accepted', true)                                   // 수락된 헬프만 필터링
      .or(`junior_id.eq.${userId},helps.senior_id.eq.${userId}`); // 사용자가 주니어 또는 시니어인 경우

    // 에러 발생 시 예외 던지기
    if (error) throw error;

    // 데이터를 ChatRoom 엔티티 형태로 변환
    return (data ?? []).map((row: HelpApplicantRow) => ({
      helpId: row.help_id,                    // 헬프 ID를 채팅방 ID로 사용
      juniorId: row.junior_id,                // 주니어 ID
      seniorId: row.helps[0].senior_id,       // 시니어 ID (조인 결과는 배열이므로 첫 번째 요소)
      createdAt: row.helps[0].created_at,     // 생성일 (조인 결과는 배열이므로 첫 번째 요소)
    }));
  }

  // ===== 헬프 ID로 특정 채팅방 상세 정보 조회 =====
  // 1. help_applicants 테이블에서 특정 helpId의 수락된 데이터 조회
  // 2. helps 테이블과 조인하여 시니어 정보 가져오기
  // 3. 단일 결과만 반환 (.single() 사용)
  async findRoomByHelpId(helpId: number): Promise<ChatRoom | null> {
    // Supabase 쿼리 실행 (단일 결과)
    const { data, error } = await supabase
      .from('help_applicants')                                    // help_applicants 테이블 선택
      .select(`help_id, junior_id, is_accepted, helps!inner(id, senior_id, created_at)`)  // helps 테이블과 조인
      .eq('is_accepted', true)                                   // 수락된 헬프만 필터링
      .eq('help_id', helpId)                                     // 특정 헬프 ID로 필터링
      .single();                                                  // 단일 결과만 반환

    // 데이터가 없거나 에러 발생 시 null 반환
    if (error || !data) return null;
    
    // 타입 단언으로 구체적인 타입 지정
    const row = data as HelpApplicantRow;
    
    // ChatRoom 엔티티 형태로 변환하여 반환
    return {
      helpId: row.help_id,                    // 헬프 ID를 채팅방 ID로 사용
      juniorId: row.junior_id,                // 주니어 ID
      seniorId: row.helps[0].senior_id,       // 시니어 ID (조인 결과는 배열이므로 첫 번째 요소)
      createdAt: row.helps[0].created_at,     // 생성일 (조인 결과는 배열이므로 첫 번째 요소)
    };
  }
} 