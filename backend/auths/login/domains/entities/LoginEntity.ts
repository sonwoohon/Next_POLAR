export class LoginEntity {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public phoneNumber: string,
    public age: number,
    public address: string,
    public profileImgUrl: string,
    public password: string,
    public createdAt: Date
  ) {}
}
