import { supabase } from '@/lib/supabase';
import { ContactReadStatusEntity } from '@/backend/chats/read_statuses/domains/entities/contactReadStatus';
import { IContactReadStatusRepository } from '@/backend/chats/read_statuses/domains/repositories/ContactReadStatusRepository';

export class SbContactReadStatusRepository implements IContactReadStatusRepository {
  private supabase = supabase;
  private table = 'contact_read_statuses';

  async findByRoomAndReader(contactRoomId: number, readerId: number): Promise<ContactReadStatusEntity | null> {
    console.log(`[Repository] 읽음 상태 조회 시작: contactRoomId=${contactRoomId}, readerId=${readerId}`);
    
    // 먼저 전체 데이터 확인
    const { data: allData, error: allError } = await this.supabase
      .from(this.table)
      .select('*');
    
    console.log(`[Repository] 전체 데이터:`, allData);
    
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('contact_room_id', contactRoomId)
      .eq('reader_id', readerId)
      .single();
    
    console.log(`[Repository] Supabase 응답:`, { data, error });
    
    if (error) {
      console.error(`[Repository] Supabase 오류:`, error);
      return null;
    }
    
    if (!data) {
      console.log(`[Repository] 데이터 없음`);
      return null;
    }
    
    console.log(`[Repository] 데이터 조회 성공:`, data);
    
    return new ContactReadStatusEntity(
      data.id,
      data.contact_room_id,
      data.reader_id,
      data.last_read_message_id,
      data.updated_at ? new Date(data.updated_at) : undefined
    );
  }

  async updateReadStatus(contactRoomId: number, readerId: number, lastReadMessageId: number): Promise<ContactReadStatusEntity> {
    console.log(`[Repository] 읽음 상태 업데이트/생성 시작: contactRoomId=${contactRoomId}, readerId=${readerId}, lastReadMessageId=${lastReadMessageId}`);
    
    // 먼저 기존 레코드가 있는지 확인
    const existingRecord = await this.findByRoomAndReader(contactRoomId, readerId);
    
    if (existingRecord) {
      // 기존 레코드가 있으면 업데이트 (더 큰 메시지 ID로만 갱신)
      console.log(`[Repository] 기존 레코드 발견, 업데이트 수행`);
      console.log(`[Repository] 기존 last_read_message_id: ${existingRecord.lastReadMessageId}, 새로운 메시지 ID: ${lastReadMessageId}`);
      
      // 새로운 메시지 ID가 기존보다 클 때만 업데이트
      if (lastReadMessageId > existingRecord.lastReadMessageId) {
        const { data, error } = await this.supabase
          .from(this.table)
          .update({
            last_read_message_id: lastReadMessageId,
            updated_at: new Date().toISOString()
          })
          .eq('contact_room_id', contactRoomId)
          .eq('reader_id', readerId)
          .select()
          .single();
        
        if (error || !data) {
          console.error(`[Repository] 읽음 상태 업데이트 실패:`, error);
          throw new Error('읽음 상태 update 실패');
        }
        
        console.log(`[Repository] 읽음 상태 업데이트 성공:`, data);
        return new ContactReadStatusEntity(
          data.id,
          data.contact_room_id,
          data.reader_id,
          data.last_read_message_id,
          data.updated_at ? new Date(data.updated_at) : undefined
        );
      } else {
        // 새로운 메시지 ID가 기존보다 작거나 같으면 업데이트하지 않음
        console.log(`[Repository] 새로운 메시지 ID(${lastReadMessageId})가 기존(${existingRecord.lastReadMessageId})보다 작거나 같아 업데이트 건너뜀`);
        return existingRecord;
      }
    } else {
      // 기존 레코드가 없으면 새로 생성
      console.log(`[Repository] 기존 레코드 없음, 새로 생성`);
      const { data, error } = await this.supabase
        .from(this.table)
        .insert({
          contact_room_id: contactRoomId,
          reader_id: readerId,
          last_read_message_id: lastReadMessageId,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error || !data) {
        console.error(`[Repository] 읽음 상태 생성 실패:`, error);
        throw new Error('읽음 상태 create 실패');
      }
      
      console.log(`[Repository] 읽음 상태 생성 성공:`, data);
      return new ContactReadStatusEntity(
        data.id,
        data.contact_room_id,
        data.reader_id,
        data.last_read_message_id,
        data.updated_at ? new Date(data.updated_at) : undefined
      );
    }
  }
} 