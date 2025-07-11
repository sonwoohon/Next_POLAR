// ===== 요청 DTOs =====

// 읽음 상태 업데이트 요청 DTO (POST /api/chats/messages/read-status)
export interface UpdateReadStatusRequestDto {
  contactRoomId: number;
  lastReadMessageId: number;
}

// ===== 응답 DTOs =====

// 읽음 상태 응답 DTO
export interface ReadStatusResponseDto {
  id: number;
  contactRoomId: number;
  readerId: number;
  lastReadMessageId: number;
  updatedAt: string;
}

// 읽음 상태 업데이트 성공 응답 DTO
export interface UpdateReadStatusResponseDto {
  success: boolean;
  readStatus: ReadStatusResponseDto;
} 