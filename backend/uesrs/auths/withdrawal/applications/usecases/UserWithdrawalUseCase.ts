// 회원탈퇴 유스케이스 (users 테이블 기준)
import { User } from '@/backend/uesrs/auths/withdrawal/domains/entities/User';
import { UserRepository } from '@/backend/uesrs/auths/withdrawal/domains/repository/UserRepository';

    // 회원탈퇴 유스케이스
export class UserWithdrawalUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(userId: number, type: 'SOFT' | 'HARD' = 'HARD'): Promise<void> {
        // 1. 사용자 존재 확인
        const user = await this.userRepository.findById(userId);
        if (!user) {
        throw new Error('사용자를 찾을 수 없습니다.');
        }
        // 2. 실제 사용자 삭제 (하드/소프트)
        if (type === 'HARD') {
        await this.userRepository.deleteById(userId);
        } else {
        // await this.userRepository.softDeleteById(userId);
        throw new Error('소프트 삭제는 현재 지원하지 않습니다.');
        }
    }
}