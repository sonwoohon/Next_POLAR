import { CommonUserEntity } from '@/backend/users/domains/entities/UserEntity';

// Repository 인터페이스
export interface IUserRepository {
  getAllUsers(): Promise<CommonUserEntity[]>;
  getUserById(id: number): Promise<CommonUserEntity | null>;
  updateUser(
    id: number,
    user: CommonUserEntity
  ): Promise<CommonUserEntity | null>;
  updatePassword(id: number, newPassword: string): Promise<boolean>;
}

// Repository 구현체
export class UserRepository implements IUserRepository {
  constructor(private readonly repository: IUserRepository) {}

  async getAllUsers(): Promise<CommonUserEntity[]> {
    return this.repository.getAllUsers();
  }

  async getUserById(id: number): Promise<CommonUserEntity | null> {
    return this.repository.getUserById(id);
  }

  async updateUser(
    id: number,
    user: CommonUserEntity
  ): Promise<CommonUserEntity | null> {
    return this.repository.updateUser(id, user);
  }

  async updatePassword(id: number, newPassword: string): Promise<boolean> {
    return this.repository.updatePassword(id, newPassword);
  }
}
