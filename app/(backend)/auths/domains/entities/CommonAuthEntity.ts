// 공용 사용자 인증 엔티티
export class CommonAuthEntity {
  constructor(
    public readonly id: number, // int8 - 수정 불가능
    public phone_number: string, // varchar
    public password: string, // varchar
    public email: string, // varchar
    public age: number, // int4
    public profile_img_url: string, // text
    public address: string, // varchar
    public name: string, // varchar
    public readonly created_at: Date // timestamp - 수정 불가능
  ) {}

  // 엔티티를 객체로 변환하는 메서드
  toJSON() {
    return {
      id: this.id,
      phone_number: this.phone_number,
      email: this.email,
      age: this.age,
      profile_img_url: this.profile_img_url,
      address: this.address,
      name: this.name,
      created_at: this.created_at
    };
  }
}
