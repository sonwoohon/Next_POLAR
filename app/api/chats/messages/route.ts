import { NextRequest, NextResponse } from 'next/server';
import { ContactMessageUseCases } from '@/backend/chats/messages/applications/usecases/ContactMessageUseCases';
import { SbContactMessageRepository } from '@/backend/chats/messages/infrastructures/SbContactMessageRepository';
import { getUserIdFromCookie } from '@/lib/jwt';

const messageUseCases = new ContactMessageUseCases(new SbContactMessageRepository());

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get('roomId');

  console.log('[API][GET /api/chats/messages] 요청 시작:', { roomId });

  if (!roomId) {
    console.warn('[API][GET /api/chats/messages] roomId 쿼리 파라미터 누락');
    return NextResponse.json({ error: 'roomId 쿼리 파라미터가 필요합니다.' }, { status: 400 });
  }

  try {
    const messages = await messageUseCases.getMessagesByContactRoomId(Number(roomId));
    console.log('[API][GET /api/chats/messages] 메시지 조회 성공:', { roomId, count: messages.length });
    return NextResponse.json({ success: true, messages }, { status: 200 });
  } catch (error) {
    console.error('[API][GET /api/chats/messages] 메시지 조회 중 오류 발생:', error);
    return NextResponse.json({ error: '채팅 메시지 조회 중 오류 발생', detail: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  console.log('[API][POST /api/chats/messages] 메시지 생성 요청 시작');
  try {
    const { message } = await request.json();
    const contactRoomId = 1; // 임시 데이터
    const senderId = 1; // 임시 데이터

    if (!message) {
      console.warn('[API][POST /api/chats/messages] 필수 값 누락');
      return NextResponse.json({ error: '필수 값이 누락되었습니다.' }, { status: 400 });
    }

    const created = await messageUseCases.createMessage({
      senderId,
      contactRoomId,
      message,
    });

    console.log('[API][POST /api/chats/messages] 메시지 생성 성공:', created);
    return NextResponse.json({ success: true, message: created }, { status: 201 });
  } catch (error) {
    console.error('[API][POST /api/chats/messages] 메시지 생성 중 오류 발생:', error);
    return NextResponse.json({ error: '메시지 생성 중 오류 발생', detail: String(error) }, { status: 500 });
  }
} 