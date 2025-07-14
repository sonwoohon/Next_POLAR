import { CommonUserEntity } from '@/backend/users/user/domains/entities/CommonUserEntity';

// Repository 인터페이스
export interface IUserRepository {
  getUserById(id: string): Promise<CommonUserEntity | null>;
  getUserByNickname(nickname: string): Promise<CommonUserEntity | null>;
  updateUser(
    id: string,
    user: CommonUserEntity
  ): Promise<CommonUserEntity | null>;
  updateUserPartial(
    id: string,
    updates: Partial<{
      phoneNumber: string;
      password: string;
      email: string;
      age: number;
      profileImgUrl: string | null;
      address: string;
      name: string;
      nickname: string;
    }>
  ): Promise<CommonUserEntity | null>;
}
