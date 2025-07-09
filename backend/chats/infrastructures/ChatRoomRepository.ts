// 환경변수 체크 및 안내
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.error('❌ [환경변수 오류] .env(.local)에 SUPABASE_URL, SUPABASE_KEY가 정확히 설정되어 있는지 확인하세요!');
  console.error('현재 SUPABASE_URL:', process.env.SUPABASE_URL);
  console.error('현재 SUPABASE_KEY:', process.env.SUPABASE_KEY ? 'OK' : 'MISSING');
  throw new Error('환경변수(SUPABASE_URL, SUPABASE_KEY)가 누락되어 Supabase 클라이언트를 생성할 수 없습니다.');
}

import { createClient } from '@supabase/supabase-js';
import { IChatRoomRepository } from '../domains/repositories/IChatRoomRepository';
import { ChatRoom } from '../domains/entities/ChatRoom';

// Supabase 쿼리 결과 타입 정의
interface HelpApplicantRow {
  help_id: number;
  junior_id: number;
  is_accepted: boolean;
  helps: {
    id: number;
    senior_id: number;
    created_at: string;
  }[];
}

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export class ChatRoomRepository implements IChatRoomRepository {
  // userId가 참여한 모든 대화방(helps) 리스트 조회
  async findRoomsByUserId(userId: number): Promise<ChatRoom[]> {
    // helps와 help_applicants 조인, is_accepted=true 조건
    const { data, error } = await supabase
      .from('help_applicants')
      .select(`help_id, junior_id, is_accepted, helps!inner(id, senior_id, created_at)`) // users 조인은 생략
      .eq('is_accepted', true)
      .or(`junior_id.eq.${userId},helps.senior_id.eq.${userId}`);

    if (error) throw error;

    return (data ?? []).map((row: HelpApplicantRow) => {
      return {
        helpId: row.help_id,
        juniorId: row.junior_id,
        seniorId: row.helps[0].senior_id, // 배열이므로 첫 번째 요소 사용
        createdAt: row.helps[0].created_at, // 배열이므로 첫 번째 요소 사용
      };
    });
  }

  // helpId로 특정 대화방(1개) 정보 조회
  async findRoomByHelpId(helpId: number): Promise<ChatRoom | null> {
    const { data, error } = await supabase
      .from('help_applicants')
      .select(`help_id, junior_id, is_accepted, helps!inner(id, senior_id, created_at)`)
      .eq('is_accepted', true)
      .eq('help_id', helpId)
      .single();

    if (error || !data) return null;
    
    // 타입 단언을 사용하여 구체적인 타입으로 변환
    const row = data as HelpApplicantRow;
    return {
      helpId: row.help_id,
      juniorId: row.junior_id,
      seniorId: row.helps[0].senior_id, // 배열이므로 첫 번째 요소 사용
      createdAt: row.helps[0].created_at, // 배열이므로 첫 번째 요소 사용
    };
  }
} 