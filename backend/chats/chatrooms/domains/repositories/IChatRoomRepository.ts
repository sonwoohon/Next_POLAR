import { ChatRoom } from '@/backend/chats/chatrooms/domains/entities/ChatRoom';

export interface IChatRoomRepository {
  // userId가 참여한 모든 대화방 리스트 조회
  findRoomsByUserId(userId: string): Promise<ChatRoom[]>;

  // chatRoomId로 특정 채팅방 조회
  findRoomByChatRoomId(chatRoomId: number): Promise<ChatRoom | null>;

  // chatRoomId로 특정 채팅방 조회 (nickname 포함)
  findRoomWithNicknamesByChatRoomId(
    chatRoomId: number
  ): Promise<ChatRoom | null>;

  // chatRoomId로 연결된 helpId 목록 조회
  findHelpIdsByChatRoomId(chatRoomId: number): Promise<number[]>;

  // nickname이 특정 채팅방에 접근 권한이 있는지 확인
  checkUserAccessToChatRoom(nickname: string, chatRoomId: number): Promise<boolean>;
}
