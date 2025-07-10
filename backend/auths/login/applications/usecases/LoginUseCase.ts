import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { LoginRequest, LoginResponseDTO } from '@/backend/auths/login/LoginModel';
import { LoginRepositoryInterface } from '@/backend/auths/login/domains/repository/LoginRepositoryInterface';
import { LoginMapper } from '@/backend/auths/login/infrastructures/mappers/LoginMapper';

// 실제 구현
export class LoginUseCase {
  private loginRepository: LoginRepositoryInterface;

  constructor(loginRepository: LoginRepositoryInterface) {
    this.loginRepository = loginRepository;
  }

  async execute(request: LoginRequest): Promise<LoginResponseDTO> {
    // 입력 검증
    if (!request.loginId || !request.password) {
      throw new Error('로그인 ID와 비밀번호를 입력해주세요.');
    }

    if (
      typeof request.loginId !== 'string' ||
      typeof request.password !== 'string'
    ) {
      throw new Error('잘못된 입력 형식입니다.');
    }

    if (
      request.loginId.trim().length === 0 ||
      request.password.trim().length === 0
    ) {
      throw new Error('로그인 ID와 비밀번호를 입력해주세요.');
    }

    if (!this.loginRepository) {
      throw new Error('LoginRepository가 초기화되지 않았습니다.');
    }

    // 1. 유저 조회 (phoneNumber 또는 email)
    const user = await this.loginRepository.findUserByLoginId(request.loginId);

    // 2. 유효성 검증
    if (!user || user.password !== request.password) {
      throw new Error('로그인 정보가 올바르지 않습니다.');
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

    // 비밀번호 등 민감 정보는 응답에서 제외
    return LoginMapper.toLoginResponseDTO(user, accessToken, refreshToken);
  }
}
