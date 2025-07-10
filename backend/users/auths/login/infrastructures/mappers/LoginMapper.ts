import { LoginEntity } from '../../domains/entities/LoginEntity';

export class LoginMapper {
  static toLoginEntity(user: LoginEntity) {
    return new LoginEntity(
      user.id,
      user.name,
      user.email,
      user.phoneNumber,
      user.age,
      user.address,
      user.profileImgUrl,
      user.password,
      user.createdAt,
      user.updatedAt
    );
  }
}
