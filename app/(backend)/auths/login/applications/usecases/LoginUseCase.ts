import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { LoginRequest, LoginResponseDTO } from '../../LoginModel';
import { LoginRepositoryInterface } from '../../domains/repository/LoginRepositoryInterface';
import { LoginMapper } from '../../infrastructures/mappers/LoginMapper';

// 실제 구현
export class LoginUseCase {
  private loginRepository: LoginRepositoryInterface;

  constructor(loginRepository: LoginRepositoryInterface) {
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

    // 비밀번호 등 민감 정보는 응답에서 제외
    return LoginMapper.toLoginResponseDTO(user, accessToken, refreshToken);
  }
}
