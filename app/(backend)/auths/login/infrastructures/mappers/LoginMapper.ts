import { LoginDBResponse } from '../../LoginModel';
import { LoginResponseDTO } from '../../applications/dtos/LoginResponse';
import { LoginUserEntity } from '../../domains/entities/LoginUserEntity';

export class LoginMapper {
  static toLoginResponseDTO(
    user: LoginUserEntity,
    accessToken: string,
    refreshToken: string
  ) {
    return new LoginResponseDTO(
      { id: user.id, loginId: user.loginId },
      accessToken,
      refreshToken
    );
  }

  static toLoginUserEntity(user: LoginDBResponse) {
    return new LoginUserEntity(user.id, user.loginId, user.password);
  }
}
