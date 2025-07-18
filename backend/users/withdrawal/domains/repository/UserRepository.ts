import { User } from '@/backend/users/withdrawal/domains/entities/User';

// UserRepository 인터페이스 (DB 연동용)
export interface UserRepository {
    findById(id: number): Promise<User | null>;
    makeNullById(id: number): Promise<void>;
} 