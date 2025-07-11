import { ChatRoom } from '@/backend/chats/chatrooms/domains/entities/ChatRoom';

export interface IChatRoomRepository {
  // userId가 참여한 모든 대화방(helps) 리스트 조회
  findRoomsByUserId(userId: number): Promise<ChatRoom[]>;

  // helpId로 특정 대화방(1개) 정보 조회
  findRoomByHelpId(helpId: number): Promise<ChatRoom | null>;
} 