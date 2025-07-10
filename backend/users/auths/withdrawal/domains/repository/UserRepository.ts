import { User } from '@/backend/users/auths/withdrawal/domains/entities/User';

// UserRepository 인터페이스 (DB 연동용)
export interface UserRepository {
    findById(id: number): Promise<User | null>;
    deleteById(id: number): Promise<void>; // 하드 삭제
} 