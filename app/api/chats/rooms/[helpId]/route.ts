import { NextRequest, NextResponse } from 'next/server';
import { GetChatRoomDetailUseCase } from '@/backend/chats/applications/usecases/GetChatRoomDetailUseCase';
import { ChatRoomRepository } from '@/backend/chats/infrastructures/repositories/IChatRoomRepository';

// GET /api/chats/rooms/[helpId]
export async function GET(req: NextRequest, { params }: { params: { helpId: string } }) {
  const helpId = Number(params.helpId);
  if (isNaN(helpId)) return NextResponse.json({ error: 'Invalid helpId' }, { status: 400 });

  // 유스케이스 실행
  const usecase = new GetChatRoomDetailUseCase(new ChatRoomRepository());
  const room = await usecase.execute({ helpId });

  if (!room) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // 성공 시 HTTP 상태 코드 콘솔 출력
  console.log('GET /api/chats/rooms/[helpId] - Status: 200 OK');
  
  // 결과 반환
  return NextResponse.json(room);
} 