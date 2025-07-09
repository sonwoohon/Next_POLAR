import { User } from '@/backend/uesrs/auths/withdrawal/domains/entities/User';

// UserRepository 인터페이스 (DB 연동용)
export interface UserRepository {
    findById(id: number): Promise<User | null>;
    deleteById(id: number): Promise<void>; // 하드 삭제
    // softDeleteById(id: number): Promise<void>; // 소프트 삭제용(필요시)
} 