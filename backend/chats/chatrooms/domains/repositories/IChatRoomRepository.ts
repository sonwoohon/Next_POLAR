import { ChatRoom } from '@/backend/chats/chatrooms/domains/entities/ChatRoom';

export interface IChatRoomRepository {
  // userId가 참여한 모든 대화방 리스트 조회
  findRoomsByUserId(userId: number): Promise<ChatRoom[]>;

  // chatRoomId로 특정 대화방(1개) 정보 조회
  findRoomByChatRoomId(chatRoomId: number): Promise<ChatRoom | null>;

  // 시니어-주니어 조합으로 기존 채팅방 조회
  findRoomByParticipants(juniorId: number, seniorId: number): Promise<ChatRoom | null>;

  // chatRoomId로 연결된 helpId 목록 조회
  findHelpIdsByChatRoomId(chatRoomId: number): Promise<number[]>;
} 