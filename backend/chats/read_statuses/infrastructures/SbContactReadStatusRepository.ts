import { supabase } from '@/lib/supabase';
import { ContactReadStatusEntity } from '@/backend/chats/read_statuses/domains/entities/contactReadStatus';
import { IContactReadStatusRepository } from '@/backend/chats/read_statuses/domains/repositories/ContactReadStatusRepository';

export class SbContactReadStatusRepository implements IContactReadStatusRepository {
  private supabase = supabase;
  private table = 'contact_read_statuses';

  async findByRoomAndReader(contactRoomId: number, readerId: number): Promise<ContactReadStatusEntity | null> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('contact_room_id', contactRoomId)
      .eq('reader_id', readerId)
      .single();
    if (error || !data) return null;
    return new ContactReadStatusEntity(
      data.id,
      data.contact_room_id,
      data.reader_id,
      data.last_read_message_id,
      data.updated_at ? new Date(data.updated_at) : undefined
    );
  }

  async upsertReadStatus(contactRoomId: number, readerId: number, lastReadMessageId: number): Promise<ContactReadStatusEntity> {
    const { data, error } = await this.supabase
      .from(this.table)
      .upsert({
        contact_room_id: contactRoomId,
        reader_id: readerId,
        last_read_message_id: lastReadMessageId
      }, { onConflict: 'contact_room_id,reader_id' })
      .select()
      .single();
    if (error || !data) throw new Error('읽음 상태 upsert 실패');
    return new ContactReadStatusEntity(
      data.id,
      data.contact_room_id,
      data.reader_id,
      data.last_read_message_id,
      data.updated_at ? new Date(data.updated_at) : undefined
    );
  }
} 