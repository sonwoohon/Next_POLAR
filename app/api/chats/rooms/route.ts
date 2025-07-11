import { NextRequest, NextResponse } from 'next/server';
import { GetChatRoomsUseCase } from '@/backend/chats/chatrooms/applications/usecases/GetChatRoomsUseCase';
import { CreateChatRoomUseCase } from '@/backend/chats/chatrooms/applications/usecases/CreateChatRoomUseCase';
import { SbChatRoomRepository } from '@/backend/chats/chatrooms/infrastructures/repositories/SbChatRoomRepository';
import { getUserIdFromCookie } from '@/lib/jwt';

// GET /api/chats/rooms
export async function GET(req: NextRequest) {
  // JWT에서 userId 추출 (로그인한 사용자)
  const userId = getUserIdFromCookie(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // 유스케이스 실행
  const usecase = new GetChatRoomsUseCase(new SbChatRoomRepository());
  const rooms = await usecase.execute({ userId });

  // 결과 반환
  return NextResponse.json(rooms);
}

// POST /api/chats/rooms
export async function POST(req: NextRequest) {
  // JWT에서 userId 추출 (로그인한 사용자)
  const userId = getUserIdFromCookie(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // 요청 본문 파싱
  const body = await req.json();
  const { juniorId, seniorId, helpId } = body;

  // 필수 필드 검증
  if (!juniorId || !seniorId) {
    return NextResponse.json({ error: 'juniorId and seniorId are required' }, { status: 400 });
  }

  // 권한 검증 (요청한 사용자가 juniorId 또는 seniorId와 일치해야 함)
  if (userId !== juniorId && userId !== seniorId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // 유스케이스 실행
  const usecase = new CreateChatRoomUseCase(new SbChatRoomRepository());
  const room = await usecase.execute({ juniorId, seniorId, helpId });

  // 결과 반환
  return NextResponse.json(room, { status: 201 });
} 