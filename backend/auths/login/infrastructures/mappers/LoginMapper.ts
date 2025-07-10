import {
  LoginDBResponse,
  LoginResponseWithoutPassword,
} from '@/backend/auths/login/LoginModel';
import { LoginResponseDTO } from '@/backend/auths/login/applications/dtos/LoginResponse';
import { LoginUserEntity } from '@/backend/auths/login/domains/entities/LoginUserEntity';

export class LoginMapper {
  static toLoginResponseDTO(
    user: LoginUserEntity,
    accessToken: string,
    refreshToken: string
  ) {
    const LoginDataWithoutPassword: LoginResponseWithoutPassword = {
      id: user.id,
      loginId: user.loginId,
    };

    return new LoginResponseDTO(
      LoginDataWithoutPassword,
      accessToken,
      refreshToken
    );
  }

  static toLoginUserEntity(user: LoginDBResponse) {
    return new LoginUserEntity(user.id, user.loginId, user.password);
  }
}
