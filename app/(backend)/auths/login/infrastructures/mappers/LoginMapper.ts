import { LoginDBResponse } from '../../LoginModel';
import { LoginUserEntity } from '../../domains/entities/LoginUserEntity';

export class LoginMapper {
  static toLoginResponseDTO(
    user: LoginUserEntity,
    accessToken: string,
    refreshToken: string
  ) {
    return {
      user: {
        id: user.id,
        loginId: user.loginId,
      },
      accessToken,
      refreshToken,
    };
  }

  static toLoginUserEntity(user: LoginDBResponse) {
    return new LoginUserEntity(user.id, user.loginId, user.password);
  }
}
