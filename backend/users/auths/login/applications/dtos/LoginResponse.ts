import { LoginResponseWithoutPassword } from '../../LoginModel';

export class LoginResponseDTO {
  constructor(
    public user: LoginResponseWithoutPassword,
    public accessToken: string,
    public refreshToken: string
  ) {}
}
