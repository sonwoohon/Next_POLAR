import { NextRequest, NextResponse } from 'next/server';
import { ContactMessageUseCases } from '@/backend/chats/messages/applications/usecases/ContactMessageUseCases';
import { SbContactMessageRepository } from '@/backend/chats/messages/infrastructures/repositories/SbContactMessageRepository';
import { ContactReadStatusUseCases } from '@/backend/chats/read_statuses/applications/usecases/ContactReadStatusUseCases';
import { SbContactReadStatusRepository } from '@/backend/chats/read_statuses/infrastructures/SbContactReadStatusRepository';
import { getUserIdFromCookie } from '@/lib/jwt';

const messageUseCases = new ContactMessageUseCases(new SbContactMessageRepository());
const readStatusUseCases = new ContactReadStatusUseCases(new SbContactReadStatusRepository());

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const roomId = 2 //Number(searchParams.get('roomId')); //임시 데이터

  console.log('[API][GET /api/chats/messages] 요청 시작:', { roomId });

  if (!roomId) {
    console.warn('[API][GET /api/chats/messages] roomId 쿼리 파라미터 누락');
    return NextResponse.json({ error: 'roomId 쿼리 파라미터가 필요합니다.' }, { status: 400 });
  }

  // 쿠키에서 사용자 ID 가져오기
  const readerId = getUserIdFromCookie(request);
  if (!readerId) {
    console.warn('[API][GET /api/chats/messages] 인증되지 않은 사용자');
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  try {
    const messages = await messageUseCases.getMessagesByContactRoomId(roomId);
    console.log('[API][GET /api/chats/messages] 메시지 조회 성공:', { roomId, count: messages.length });
    
    // 읽음 상태 조회
    const readStatus = await readStatusUseCases.getReadStatus(roomId, readerId);
    console.log('읽음 상태 조회 결과:', readStatus);
    
    // 메시지가 있고 읽음 상태가 있으면 가장 최근 메시지 ID로 갱신
    if (messages.length > 0 && readStatus) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.id) {
        await readStatusUseCases.updateReadStatus(roomId, readerId, lastMessage.id);
        console.log('[API][GET /api/chats/messages] 읽음 상태 갱신 완료:', { lastMessageId: lastMessage.id });
      }
    }
    
    // 각 메시지에 읽음/안읽음 상태 추가
    const messagesWithReadStatus = messages.map(message => {
      const isRead = readStatus && message.id ? message.id <= readStatus.lastReadMessageId : false;
      return {
        ...message.toJSON(),
        isRead
      };
    });
    
    return NextResponse.json({ 
      success: true, 
      messages: messagesWithReadStatus,
      readStatus: readStatus?.toJSON() || null
    }, { status: 200 });
  } catch (error) {
    console.error('[API][GET /api/chats/messages] 메시지 조회 중 오류 발생:', error);
    return NextResponse.json({ error: '채팅 메시지 조회 중 오류 발생', detail: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  console.log('[API][POST /api/chats/messages] 메시지 생성 요청 시작');
  
  // 쿠키에서 사용자 ID 가져오기
  const senderId = getUserIdFromCookie(request);
  if (!senderId) {
    console.warn('[API][POST /api/chats/messages] 인증되지 않은 사용자');
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  try {
    const { message } = await request.json();
    const contactRoomId = 2; // 임시 데이터

    if (!message) {
      console.warn('[API][POST /api/chats/messages] 필수 값 누락');
      return NextResponse.json({ error: '필수 값이 누락되었습니다.' }, { status: 400 });
    }

    const created = await messageUseCases.createMessage({
      senderId: senderId,
      contactRoomId,
      message,
    });

    // 메시지 생성 후 읽음 상태 업데이트 (없으면 추가, 있으면 갱신)
    if (created && created.id) {
      await readStatusUseCases.updateReadStatus(contactRoomId, senderId, created.id);
      console.log('[API][POST /api/chats/messages] 읽음 상태 업데이트 완료:', { messageId: created.id });
    }

    console.log('[API][POST /api/chats/messages] 메시지 생성 및 읽음 상태 업데이트 성공:', created);
    return NextResponse.json({ success: true, message: created }, { status: 201 });
  } catch (error) {
    console.error('[API][POST /api/chats/messages] 메시지 생성 중 오류 발생:', error);
    return NextResponse.json({ error: '메시지 생성 중 오류 발생', detail: String(error) }, { status: 500 });
  }
} 