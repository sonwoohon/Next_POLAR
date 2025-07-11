export interface ChatRoom {
  helpId: number;      // help(매칭) 고유 ID, 이게 곧 대화방 ID
  juniorId: number;    // 주니어 유저 ID
  seniorId: number;    // 시니어 유저 ID
  createdAt: string;   // 대화방(헬프) 생성일 (ISO 문자열)
} 