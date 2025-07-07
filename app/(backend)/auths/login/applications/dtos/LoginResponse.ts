export class LoginResponseDTO {
  constructor(
    public user: { id: number; loginId: string },
    public accessToken: string,
    public refreshToken: string
  ) {}
}
