<<<<<<<< HEAD:backend/users/user/domains/repositories/UserRepository.ts
import { CommonUserEntity } from '@/backend/users/user/domains/entities/CommonUserEntity';
========
import { CommonUserEntity } from '@/backend/common/entities/UserEntity';
>>>>>>>> 714e74345bf047750ce28a37052b6141b2547621:backend/common/repositories/IUserRepository.ts

// Repository 인터페이스
export interface IUserRepository {
  getUserById(id: number): Promise<CommonUserEntity | null>;
  updateUser(
    id: number,
    user: CommonUserEntity
  ): Promise<CommonUserEntity | null>;
}
