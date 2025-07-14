// ===== 조회 응답 DTOs =====

// 채팅방 기본 정보 응답 DTO (닉네임 기반)
export interface ChatRoomResponseDto {
  chatRoomId: number;
  helpId?: number;
  juniorNickname: string; // UUID 대신 닉네임
  seniorNickname: string; // UUID 대신 닉네임
  createdAt: string;
}

// 채팅방 목록 응답 DTO
export interface ChatRoomListResponseDto {
  rooms: ChatRoomResponseDto[];
  totalCount: number;
}

// 채팅방 상세 정보 응답 DTO (닉네임 기반)
export interface ChatRoomDetailResponseDto {
  chatRoomId: number;
  helpId?: number;
  juniorNickname: string; // UUID 대신 닉네임
  seniorNickname: string; // UUID 대신 닉네임
  createdAt: string;
  participants: {
    junior: {
      nickname: string; // 닉네임
      name: string;
      profileImgUrl: string;
    };
    senior: {
      nickname: string; // 닉네임
      name: string;
      profileImgUrl: string;
    };
  };
  helpInfo: {
    title: string;
    description: string;
    status: string;
  };
}
