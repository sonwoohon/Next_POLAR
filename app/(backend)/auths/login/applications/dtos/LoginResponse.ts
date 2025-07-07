import { LoginDBResponse } from '../../LoginModel';

export class LoginResponseDTO {
  constructor(
    public user: LoginDBResponse,
    public accessToken: string,
    public refreshToken: string
  ) {}
}
