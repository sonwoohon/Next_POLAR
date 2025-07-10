// 회원탈퇴 유스케이스 (users 테이블 기준)
import { User } from '@/backend/uesrs/auths/withdrawal/domains/entities/User';
import { UserRepository } from '@/backend/uesrs/auths/withdrawal/domains/repository/UserRepository';

    // 회원탈퇴 유스케이스
export class UserWithdrawalUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(userId: number): Promise<void> {
        // 1. 사용자 존재 확인
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('사용자를 찾을 수 없습니다.');
        }
        
        // 2. 사용자 삭제 (하드 삭제)
        await this.userRepository.deleteById(userId);
        
        // 3. 탈퇴 성공 로그 출력
        console.log(`사용자 ID ${userId} 탈퇴가 성공적으로 완료되었습니다.`);
    }
}