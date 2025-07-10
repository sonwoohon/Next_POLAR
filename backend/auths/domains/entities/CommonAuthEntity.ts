// 공용 사용자 인증 엔티티
export class CommonAuthEntity {
  constructor(
    public readonly id: number, // int8 - 수정 불가능
    public phoneNumber: string, // varchar
    public password: string, // varchar
    public email: string, // varchar
    public age: number, // int4
    public profileImgUrl: string, // text
    public address: string, // varchar
    public name: string, // varchar
    public readonly createdAt: Date // timestamp - 수정 불가능
  ) {}

  // 엔티티를 객체로 변환하는 메서드
  toJSON() {
    return {
      id: this.id,
      phoneNumber: this.phoneNumber,
      email: this.email,
      age: this.age,
      profileImgUrl: this.profileImgUrl,
      address: this.address,
      name: this.name,
      createdAt: this.createdAt
    };
  }
} 