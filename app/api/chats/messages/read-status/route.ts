import { NextRequest, NextResponse } from 'next/server';
import { ContactReadStatusUseCases } from '@/backend/chats/read_statuses/applications/usecases/ContactReadStatusUseCases';
import { SbContactReadStatusRepository } from '@/backend/chats/read_statuses/infrastructures/SbContactReadStatusRepository';
import { getUserIdFromCookie } from '@/lib/jwt';

const readStatusUseCases = new ContactReadStatusUseCases(new SbContactReadStatusRepository());

export async function POST(request: NextRequest) {
  console.log('[API][POST /api/chats/messages/read-status] 읽음 상태 업데이트 요청 시작');
  
  // 쿠키에서 사용자 ID 가져오기
  const readerId = getUserIdFromCookie(request);
  if (!readerId) {
    console.warn('[API][POST /api/chats/messages/read-status] 인증되지 않은 사용자');
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  try {
    const { contactRoomId, lastReadMessageId } = await request.json();

    if (!contactRoomId || !lastReadMessageId) {
      console.warn('[API][POST /api/chats/messages/read-status] 필수 값 누락');
      return NextResponse.json({ error: '필수 값이 누락되었습니다.' }, { status: 400 });
    }

    const updatedReadStatus = await readStatusUseCases.updateReadStatus(
      contactRoomId,
      readerId,
      lastReadMessageId
    );

    console.log('[API][POST /api/chats/messages/read-status] 읽음 상태 업데이트 성공:', updatedReadStatus);
    return NextResponse.json({ 
      success: true, 
      readStatus: updatedReadStatus.toJSON()
    }, { status: 200 });
  } catch (error) {
    console.error('[API][POST /api/chats/messages/read-status] 읽음 상태 업데이트 중 오류 발생:', error);
    return NextResponse.json({ error: '읽음 상태 업데이트 중 오류 발생', detail: String(error) }, { status: 500 });
  }
} 