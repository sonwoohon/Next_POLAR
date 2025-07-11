export class SignUpEntity {
  public readonly id: bigint;
  public uuid: string;
  public name: string;
  public phoneNumber: bigint;
  public password: string;
  public email: string;
  public age?: number;
  public profileImgUrl?: string;
  public address?: string;

  constructor(params: {
    id: bigint;
    uuid: string;
    name: string;
    phoneNumber: bigint;
    password: string;
    email: string;
    age?: number;
    profileImgUrl?: string;
    address?: string;
  }) {
    this.id = params.id;
    this.uuid = params.uuid;
    this.name = params.name;
    this.phoneNumber = params.phoneNumber;
    this.password = params.password;
    this.email = params.email;
    this.age = params.age;
    this.profileImgUrl = params.profileImgUrl;
    this.address = params.address;
  }
}
