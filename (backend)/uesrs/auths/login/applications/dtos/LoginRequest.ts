export class LoginRequestDTO {
  constructor(
    public loginId: string, // 전화번호 또는 이메일 (프론트에서 어떤 걸 쓸지 결정)
    public password: string // 비밀번호
  ) {}
}
