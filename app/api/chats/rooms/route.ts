import { NextRequest, NextResponse } from 'next/server';
import { GetChatRoomsUseCase } from '@/backend/chats/chatrooms/applications/usecases/GetChatRoomsUseCase';
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
  const myUserId = getUserIdFromCookie(req);
  if (!myUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // 요청 본문 파싱
  const body = await req.json();
  const { userId } = body; // 상대방 userId

  // 필수 필드 검증
  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  // 본인과 본인 채팅방은 허용하지 않음
  if (myUserId === userId) {
    return NextResponse.json({ error: '자기 자신과는 채팅방을 만들 수 없습니다.' }, { status: 400 });
  }

  // 두 명의 조합으로 채팅방 조회 (생성 X, 조회만)
  const repo = new SbChatRoomRepository();
  const room = await repo.findRoomByParticipants(myUserId, userId) || await repo.findRoomByParticipants(userId, myUserId);

  if (!room) {
    return NextResponse.json({ error: '채팅방이 존재하지 않습니다.' }, { status: 404 });
  }

  return NextResponse.json(room, { status: 200 });
} 