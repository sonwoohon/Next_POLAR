import { NextRequest, NextResponse } from 'next/server';
import { GetChatRoomsUseCase } from '@/backend/chats/chatrooms/applications/usecases/GetChatRoomsUseCase';
import { ChatRoomRepository } from '@/backend/chats/chatrooms/infrastructures/ChatRoomRepository';
import { getUserIdFromCookie } from '@/lib/jwt';

// GET /api/chats/rooms
export async function GET(req: NextRequest) {
  // JWT에서 userId 추출 (로그인한 사용자)
  const userId = getUserIdFromCookie(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // 유스케이스 실행
  const usecase = new GetChatRoomsUseCase(new ChatRoomRepository());
  const rooms = await usecase.execute(userId);

  // 결과 반환
  return NextResponse.json(rooms);
} 