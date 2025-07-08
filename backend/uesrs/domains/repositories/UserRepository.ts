import { CommonUserEntity } from '@/backend/uesrs/domains/entities/CommonUserEntity';

// Repository 인터페이스
export interface IUserRepository {
  getUserById(id: number): Promise<CommonUserEntity | null>;
  updateUser(id: number, user: CommonUserEntity): Promise<CommonUserEntity | null>;
} 