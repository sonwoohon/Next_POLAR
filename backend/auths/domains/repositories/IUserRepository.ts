import { UserEntity } from "../entities/CommonAuthEntity";

// Repository 인터페이스
export interface IUserRepository {
  getAllUsers(): Promise<UserEntity[]>;
  getUserById(id: number): Promise<UserEntity | null>;
  updateUser(id: number, user: UserEntity): Promise<UserEntity | null>;
  updatePassword(id: number, newPassword: string): Promise<boolean>;
}

// Repository 구현체
export class UserRepository implements IUserRepository{
  constructor(private readonly repository: IUserRepository) { }

  async getAllUsers(): Promise<UserEntity[]> {
    return this.repository.getAllUsers();
  }

  async getUserById(id: number): Promise<UserEntity | null> {
    return this.repository.getUserById(id);
  }

  async updateUser(id: number, user: UserEntity): Promise<UserEntity | null> {
    return this.repository.updateUser(id, user);
  }

  async updatePassword(id: number, newPassword: string): Promise<boolean> {
    return this.repository.updatePassword(id, newPassword);
  }
} 