import { CommonAuthEntity } from '@/(backend)/auths/domains/entities/CommonAuthEntity';

// Repository 인터페이스
export interface IAuthRepository {
  getAllUsers(): Promise<CommonAuthEntity[]>;
  getUserById(id: number): Promise<CommonAuthEntity | null>;
  updateUser(id: number, user: CommonAuthEntity): Promise<CommonAuthEntity | null>;
  updatePassword(id: number, newPassword: string): Promise<boolean>;
}

// Repository 구현체
export class AuthRepository implements IAuthRepository {
  constructor(private readonly repository: IAuthRepository) {}

  async getAllUsers(): Promise<CommonAuthEntity[]> {
    return this.repository.getAllUsers();
  }

  async getUserById(id: number): Promise<CommonAuthEntity | null> {
    return this.repository.getUserById(id);
  }

  async updateUser(id: number, user: CommonAuthEntity): Promise<CommonAuthEntity | null> {
    return this.repository.updateUser(id, user);
  }

  async updatePassword(id: number, newPassword: string): Promise<boolean> {
    return this.repository.updatePassword(id, newPassword);
  }
} 