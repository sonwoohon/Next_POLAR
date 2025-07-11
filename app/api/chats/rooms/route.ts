import { NextRequest, NextResponse } from 'next/server';
import { GetChatRoomsUseCase } from '@/backend/chats/chatrooms/applications/usecases/GetChatRoomsUseCase';
import { SbChatRoomRepository } from '@/backend/chats/chatrooms/infrastructures/repositories/SbChatRoomRepository';
import { getUserIdFromCookie } from '@/lib/jwt';

// GET /api/chats/rooms
export async function GET(req: NextRequest) {
  // JWT에서 userId 추출 (로그인한 사용자)
  const userId = getUserIdFromCookie(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // 쿼리 파라미터로 userId가 들어오면 단일방 조회로 분기
  const { searchParams } = new URL(req.url);
  const otherUserId = searchParams.get('userId');
  if (otherUserId) {
    const otherIdNum = Number(otherUserId);
    if (isNaN(otherIdNum)) {
      return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
    }
    if (userId === otherIdNum) {
      return NextResponse.json({ error: '자기 자신과는 채팅방을 만들 수 없습니다.' }, { status: 400 });
    }
    // 전체 채팅방 리스트에서 두 명의 조합에 해당하는 방을 찾음
    const repo = new SbChatRoomRepository();
    const allRooms = await repo.findRoomsByUserId(userId);
    const room = allRooms.find(
      r => (r.juniorId === userId && r.seniorId === otherIdNum) ||
           (r.juniorId === otherIdNum && r.seniorId === userId)
    );
    if (!room) {
      return NextResponse.json({ error: '채팅방이 존재하지 않습니다.' }, { status: 404 });
    }
    return NextResponse.json(room, { status: 200 });
  }

  // 유스케이스 실행 (리스트 조회)
  const usecase = new GetChatRoomsUseCase(new SbChatRoomRepository());
  const rooms = await usecase.execute({ userId });

  // 결과 반환
  return NextResponse.json(rooms);
} 