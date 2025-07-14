// 현재 파일은 엔티티 정의만 있으므로 import 경로 변경 필요 없음.
export class ContactMessageEntity {
  constructor(
    public readonly id: number | undefined, // 메시지 고유 ID
    public senderId: string, // uuid 변경
    public contactRoomId: number,
    public message: string, // 메시지 내용
    public readonly createdAt: Date | undefined // 생성일시
  ) {}

  toJSON() {
    return {
      id: this.id,
      senderId: this.senderId,
      contactRoomId: this.contactRoomId,
      message: this.message,
      createdAt: this.createdAt,
    };
  }
}
