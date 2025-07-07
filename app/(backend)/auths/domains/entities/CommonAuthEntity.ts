// 공용 사용자 인증 엔티티
export class CommonAuthEntity {
  constructor(
    public id: number, // int8
    public phone_number: number, // int8
    public password: string, // varchar
    public email: string, // varchar
    public age: number, // int4
    public profile_img_url: string, // text
    public address: string, // varchar
    public name: string, // varchar
    public created_at: Date // timestamp
  ) {}
}
