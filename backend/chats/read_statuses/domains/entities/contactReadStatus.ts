export class ContactReadStatusEntity {
  constructor(
    public readonly id: number | undefined, // PK
    public contactRoomId: number,
    public readerId: number,
    public lastReadMessageId: number,
    public readonly updatedAt: Date | undefined
  ) {}

  toJSON() {
    return {
      id: this.id,
      contactRoomId: this.contactRoomId,
      readerId: this.readerId,
      lastReadMessageId: this.lastReadMessageId,
      updatedAt: this.updatedAt
    };
  }
} 