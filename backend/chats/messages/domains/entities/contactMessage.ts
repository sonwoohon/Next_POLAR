// 현재 파일은 엔티티 정의만 있으므로 import 경로 변경 필요 없음.
export class ContactMessageEntity {
  constructor(
    public readonly id: number,            // 메시지 고유 ID
    public senderId: number,               // 보낸 사람 ID
    public contactRoomId: number,          // 채팅방 ID
    public isRead: boolean,                // 읽음 여부
    public message: string,                // 메시지 내용
    public readonly createdAt: Date        // 생성일시
  ) {}

  toJSON() {
    return {
      id: this.id,
      senderId: this.senderId,
      contactRoomId: this.contactRoomId,
      isRead: this.isRead,
      message: this.message,
      createdAt: this.createdAt
    };
  }
} 