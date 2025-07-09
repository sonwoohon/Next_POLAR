import { NextRequest, NextResponse } from 'next/server';
import { ContactMessageUseCases } from '@/backend/chats/messages/applications/usecases/ContactMessageUseCases';
import { SbContactMessageRepository } from '@/backend/chats/messages/infrastructures/SbContactMessageRepository';

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