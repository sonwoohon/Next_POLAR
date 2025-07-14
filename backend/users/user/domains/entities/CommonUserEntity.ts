// 공통 사용자 엔티티
export class CommonUserEntity {
  constructor(
    public readonly id: string, // uuid
    public phone_number: string,
    public password: string,
    public email: string,
    public age: number,
    public profile_img_url: string,
    public address: string,
    public name: string,
    public nickname: string,
    public readonly created_at: Date
  ) { }

  toJSON() {
    return {
      id: this.id,
      phone_number: this.phone_number,
      password: this.password,
      email: this.email,
      age: this.age,
      profile_img_url: this.profile_img_url,
      address: this.address,
      name: this.name,
      nickname: this.nickname,
      created_at: this.created_at
    };
  }
} 