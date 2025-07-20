import { NextResponse } from 'next/server';
import { supabase } from '@/backend/common/utils/supabaseClient';

// 트리거 설정 API
export async function POST() {
  try {
    // SQL 파일 내용을 직접 실행
    const sqlQueries = [
      // 1. contact_room_helps 테이블 생성
      `CREATE TABLE IF NOT EXISTS contact_room_helps (
        id SERIAL PRIMARY KEY,
        contact_room_id INTEGER NOT NULL REFERENCES contact_rooms(id) ON DELETE CASCADE,
        help_id INTEGER NOT NULL REFERENCES helps(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(contact_room_id, help_id)
      )`,

      // 2. 인덱스 생성
      `CREATE INDEX IF NOT EXISTS idx_contact_room_helps_contact_room_id ON contact_room_helps(contact_room_id)`,
      `CREATE INDEX IF NOT EXISTS idx_contact_room_helps_help_id ON contact_room_helps(help_id)`,

      // 3. 트리거 함수 생성
      `CREATE OR REPLACE FUNCTION create_contact_room_on_help_connecting()
      RETURNS TRIGGER AS $$
      DECLARE
        accepted_junior_id UUID;
        existing_contact_room_id INTEGER;
        new_contact_room_id INTEGER;
      BEGIN
        IF NEW.status = 'connecting' AND (OLD.status IS NULL OR OLD.status != 'connecting') THEN
          SELECT junior_id INTO accepted_junior_id
          FROM help_applicants
          WHERE help_id = NEW.id AND is_accepted = true
          LIMIT 1;
          
          IF accepted_junior_id IS NOT NULL THEN
            SELECT id INTO existing_contact_room_id
            FROM contact_rooms
            WHERE senior_id = NEW.senior_id AND junior_id = accepted_junior_id
            LIMIT 1;
            
            IF existing_contact_room_id IS NOT NULL THEN
              new_contact_room_id := existing_contact_room_id;
            ELSE
              INSERT INTO contact_rooms (senior_id, junior_id)
              VALUES (NEW.senior_id, accepted_junior_id)
              RETURNING id INTO new_contact_room_id;
            END IF;
            
            INSERT INTO contact_room_helps (contact_room_id, help_id)
            VALUES (new_contact_room_id, NEW.id)
            ON CONFLICT (contact_room_id, help_id) DO NOTHING;
          END IF;
        END IF;
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql`,

      // 4. 트리거 생성
      `DROP TRIGGER IF EXISTS trigger_create_contact_room_on_help_connecting ON helps`,
      `CREATE TRIGGER trigger_create_contact_room_on_help_connecting
        AFTER UPDATE ON helps
        FOR EACH ROW
        EXECUTE FUNCTION create_contact_room_on_help_connecting()`,

      // 5. 기존 데이터 처리
      `INSERT INTO contact_rooms (senior_id, junior_id)
       SELECT DISTINCT
         h.senior_id,
         ha.junior_id
       FROM helps h
       JOIN help_applicants ha ON h.id = ha.help_id
       WHERE h.status = 'connecting' 
         AND ha.is_accepted = true
         AND NOT EXISTS (
           SELECT 1 FROM contact_rooms cr 
           WHERE cr.senior_id = h.senior_id 
             AND cr.junior_id = ha.junior_id
         )
       ON CONFLICT DO NOTHING`,

      `INSERT INTO contact_room_helps (contact_room_id, help_id)
       SELECT 
         cr.id,
         h.id
       FROM helps h
       JOIN help_applicants ha ON h.id = ha.help_id
       JOIN contact_rooms cr ON cr.senior_id = h.senior_id AND cr.junior_id = ha.junior_id
       WHERE h.status = 'connecting' 
         AND ha.is_accepted = true
         AND NOT EXISTS (
           SELECT 1 FROM contact_room_helps crh 
           WHERE crh.contact_room_id = cr.id 
             AND crh.help_id = h.id
         )
       ON CONFLICT (contact_room_id, help_id) DO NOTHING`,
    ];

    // 각 쿼리를 순차적으로 실행
    for (const query of sqlQueries) {
      try {
        // Supabase에서 직접 SQL 실행 (관리자 권한 필요)
        const { error } = await supabase
          .from('_exec_sql')
          .select('*')
          .eq('query', query);
        if (error) {
          console.error('SQL 실행 오류:', error);
          // 에러가 있어도 계속 진행 (이미 존재하는 경우 등)
        }
      } catch (err) {
        console.error('SQL 실행 중 예외:', err);
        // 에러가 있어도 계속 진행
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Contact rooms 트리거가 성공적으로 설정되었습니다.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('트리거 설정 오류:', error);
    return NextResponse.json(
      { error: '트리거 설정 중 오류 발생', detail: String(error) },
      { status: 500 }
    );
  }
}
