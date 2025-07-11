// UseCase에서 사용하는 DTO (백엔드 내부)
export type CreateContactMessageDto = {
  senderId: number;
  contactRoomId: number;
  message: string;
};