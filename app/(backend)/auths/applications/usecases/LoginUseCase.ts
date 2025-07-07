import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import {
  LoginRequest,
  LoginResponseDTO,
} from '../../domains/entities/login/LoginRequest';
import { LoginRepositoryInterface } from '../repository/LoginRepositoryInterface';

// 로그인 유스케이스 인터페이스
export interface LoginUseCase {
  execute(request: LoginRequest): Promise<LoginResponseDTO>;
}

// 실제 구현
export class LoginUseCaseImpl implements LoginUseCase {
  private loginRepository: LoginRepositoryInterface | undefined;

  constructor(loginRepository?: LoginRepositoryInterface) {
    this.loginRepository = loginRepository;
  }

  async execute(request: LoginRequest): Promise<LoginResponseDTO> {
    if (!this.loginRepository) {
      throw new Error('LoginRepository가 초기화되지 않았습니다.');
    }

    // 1. 유저 조회 (phoneNumber 또는 email)
    const user = await this.loginRepository.findUserByLoginId(request.loginId);
    if (!user) {
      throw new Error('존재하지 않는 사용자입니다.');
    }

    // 2. 비밀번호 검증 (실제 서비스에서는 bcrypt 등으로 해시 비교)
    // 여기서는 더미 비교
    if (user.password !== request.password) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }

    // 3. 토큰 발급

    const accessToken = generateAccessToken({
      id: user.id,
      loginId: user.loginId,
    });
    const refreshToken = generateRefreshToken({
      id: user.id,
      loginId: user.loginId,
    });

    return { user, accessToken, refreshToken };
  }
}
