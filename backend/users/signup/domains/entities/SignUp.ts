export class SignUpEntity {
  public readonly id: string; // UUID로 변경
  public name: string;
  public phoneNumber: string; // bigint에서 string으로 변경
  public password: string;
  public email: string;
  public age?: number;
  public profileImgUrl?: string;
  public address?: string;
  public nickname: string; // 닉네임 추가

  constructor(params: {
    id: string;
    name: string;
    phoneNumber: string;
    password: string;
    email: string;
    age?: number;
    profileImgUrl?: string;
    address?: string;
    nickname: string;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.phoneNumber = params.phoneNumber;
    this.password = params.password;
    this.email = params.email;
    this.age = params.age;
    this.profileImgUrl = params.profileImgUrl;
    this.address = params.address;
    this.nickname = params.nickname;
  }
}
