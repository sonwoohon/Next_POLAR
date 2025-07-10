import { LoginResponseWithoutPassword } from '@/backend/auths/login/LoginModel';

export class LoginResponseDTO {
  constructor(
    public user: LoginResponseWithoutPassword,
    public accessToken: string,
    public refreshToken: string
  ) {}
}
