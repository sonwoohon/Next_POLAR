// 회원탈퇴 유스케이스 (users 테이블 기준)
// import { User } from '@/backend/users/withdrawal/domains/entities/User';
import { UserRepository } from '@/backend/users/withdrawal/domains/repository/UserRepository';

// 회원탈퇴 유스케이스
export class UserWithdrawalUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string): Promise<void> {
    // 1. 사용자 존재 확인
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    // 2. 사용자 삭제 (모든 칼럼을 Null로 만드는 소프트한 삭제)
    await this.userRepository.makeNullById(userId);

    // 3. 탈퇴 성공 로그 출력
  }
}
