import {
  LoginDBResponse,
  LoginResponseWithoutPassword,
} from '../../LoginModel';
import { LoginResponseDTO } from '../../applications/dtos/LoginResponse';
import { LoginUserEntity } from '../../domains/entities/LoginUserEntity';

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
