import { CommonUserEntity } from '@/backend/users/user/domains/entities/CommonUserEntity';

// Repository 인터페이스
export interface IUserRepository {
  getUserById(id: string): Promise<CommonUserEntity | null>;
  updateUser(
    id: string,
    user: CommonUserEntity
  ): Promise<CommonUserEntity | null>;
}
