import { NextRequest, NextResponse } from 'next/server';
import { ContactMessageUseCases } from '@/backend/chats/messages/applications/usecases/ContactMessageUseCases';
import { SbContactMessageRepository } from '@/backend/chats/messages/infrastructures/repositories/SbContactMessageRepository';
// import { ContactReadStatusUseCases } from '@/backend/chats/read_statuses/applications/usecases/ContactReadStatusUseCases';
// import { SbContactReadStatusRepository } from '@/backend/chats/read_statuses/infrastructures/SbContactReadStatusRepository';
import { getUserIdFromCookie } from '@/lib/jwt';

const messageUseCases = new ContactMessageUseCases(
  new SbContactMessageRepository()
);
// const readStatusUseCases = new ContactReadStatusUseCases(new SbContactReadStatusRepository());

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const roomId = Number(searchParams.get('roomId')); //임시 데이터

  console.log('[API][GET /api/chats/messages] 요청 시작:', { roomId });

  if (!roomId) {
    console.warn('[API][GET /api/chats/messages] roomId 쿼리 파라미터 누락');
    return NextResponse.json(
      { error: 'roomId 쿼리 파라미터가 필요합니다.' },
      { status: 400 }
    );
  }

  // 쿠키에서 사용자 ID 가져오기
  const readerId = getUserIdFromCookie(request);
  if (!readerId) {
    console.warn('[API][GET /api/chats/messages] 인증되지 않은 사용자');
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  try {
    const messages = await messageUseCases.getMessagesByContactRoomId(roomId);
    console.log('[API][GET /api/chats/messages] 메시지 조회 성공:', {
      roomId,
      count: messages.length,
    });

    // 읽음 상태 조회 (주석처리)
    // const readStatus = await readStatusUseCases.getReadStatus(roomId, readerId);
    // console.log('읽음 상태 조회 결과:', readStatus);

    // 메시지 조회 시 읽음 상태 업데이트 (채팅방의 최대 메시지 ID로) (주석처리)
    // if (messages.length > 0) {
    //   const maxMessageId = Math.max(...messages.map(msg => msg.id || 0));
    //   await readStatusUseCases.updateReadStatus(roomId, readerId, maxMessageId);
    //   console.log('[API][GET /api/chats/messages] 읽음 상태 갱신 완료:', { maxMessageId });
    // }

    // 각 메시지에 읽음/안읽음 상태 추가 (주석처리)
    // const messagesWithReadStatus = messages.map(message => {
    //   const isRead = readStatus && message.id ? message.id <= readStatus.lastReadMessageId : false;
    //   return {
    //     ...message.toJSON(),
    //     isRead
    //   };
    // });

    return NextResponse.json(
      {
        success: true,
        messages: messages.map((message) => message.toJSON()),
        readStatus: null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      '[API][GET /api/chats/messages] 메시지 조회 중 오류 발생:',
      error
    );
    return NextResponse.json(
      { error: '채팅 메시지 조회 중 오류 발생', detail: String(error) },
      { status: 500 }
    );
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
    const { message, roomId } = await request.json();
    const contactRoomId = Number(roomId); // 임시 데이터

    console.log('[API][POST /api/chats/messages] 요청 데이터:', {
      message,
      contactRoomId,
      senderId,
    });

    if (!message) {
      console.warn('[API][POST /api/chats/messages] 필수 값 누락');
      return NextResponse.json(
        { error: '필수 값이 누락되었습니다.' },
        { status: 400 }
      );
    }

    console.log('[API][POST /api/chats/messages] 메시지 생성 시작...');
    const created = await messageUseCases.createMessage({
      senderId: senderId,
      contactRoomId,
      message,
    });

    console.log('[API][POST /api/chats/messages] 메시지 생성 완료:', {
      messageId: created?.id,
      senderId: created?.senderId,
      contactRoomId: created?.contactRoomId,
      message: created?.message,
      createdAt: created?.createdAt,
    });

    // 메시지 생성 후 읽음 상태 업데이트 (생성된 메시지 ID로) (주석처리)
    // if (created && created.id) {
    //   await readStatusUseCases.updateReadStatus(contactRoomId, senderId, created.id);
    //   console.log('[API][POST /api/chats/messages] 읽음 상태 업데이트 완료:', { messageId: created.id });
    // }

    console.log(
      '[API][POST /api/chats/messages] 메시지 생성 성공 - 실시간 이벤트 발생 예상'
    );
    console.log(
      '[API][POST /api/chats/messages] contact_messages 테이블에 INSERT 이벤트 발생'
    );
    console.log(
      '[API][POST /api/chats/messages] Supabase Realtime이 이 이벤트를 구독자들에게 전송해야 함'
    );

    return NextResponse.json(
      { success: true, message: created },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      '[API][POST /api/chats/messages] 메시지 생성 중 오류 발생:',
      error
    );
    return NextResponse.json(
      { error: '메시지 생성 중 오류 발생', detail: String(error) },
      { status: 500 }
    );
  }
}
