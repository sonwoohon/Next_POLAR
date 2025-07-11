// 회원탈퇴 유스케이스 (users 테이블 기준)
import { User } from '@/backend/users/auths/withdrawal/domains/entities/User';
import { UserRepository } from '@/backend/users/auths/withdrawal/domains/repository/IUserRepository';
import { WithdrawalRequestDto } from '@/backend/users/auths/withdrawal/applications/dtos/WithdrawalRequestDto';
import { WithdrawalResponseDto } from '@/backend/users/auths/withdrawal/applications/dtos/WithdrawalResponseDto';

// 회원탈퇴 유스케이스
export class UserWithdrawalUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(request: WithdrawalRequestDto): Promise<WithdrawalResponseDto> {
    // 1. 사용자 존재 확인
    const user = await this.userRepository.findById(request.userId);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    // 2. 비밀번호 확인 (실제로는 해시 비교 필요)
    if (user.password !== request.confirmPassword) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }

    // 3. 사용자 삭제 (하드 삭제)
    await this.userRepository.deleteById(request.userId);

    // 4. 탈퇴 성공 로그 출력
    console.log(`사용자 ID ${request.userId} 탈퇴가 성공적으로 완료되었습니다.`);

    // 5. 응답 DTO 반환
    return {
      success: true,
      message: '회원탈퇴가 성공적으로 완료되었습니다.',
      withdrawalDate: new Date(),
      userId: request.userId
    };
  }
}
