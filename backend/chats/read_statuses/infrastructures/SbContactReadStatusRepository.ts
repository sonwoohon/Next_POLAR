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
    if (error || !data) throw new Error('읽음 상태 update 실패');
    return new ContactReadStatusEntity(
      data.id,
      data.contact_room_id,
      data.reader_id,
      data.last_read_message_id,
      data.updated_at ? new Date(data.updated_at) : undefined
    );
  }
} 