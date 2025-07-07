// Junior 사용자 인증 관련 유스케이스
// 이 파일에는 Junior 사용자의 인증과 관련된 비즈니스 로직이 구현됩니다.

// 예시:
// - RegisterJuniorUseCase: Junior 회원가입
// - LoginJuniorUseCase: Junior 로그인
// - LogoutJuniorUseCase: Junior 로그아웃
// - UpdateJuniorProfileUseCase: Junior 프로필 수정
// - ResetJuniorPasswordUseCase: Junior 비밀번호 재설정

// 유스케이스는 비즈니스 로직을 구현하며, 엔티티를 조작하고 비즈니스 규칙을 적용합니다.
import { SbAuthRepository } from "../../infrastructures/repositories/SbAuthRepository";
import { SignUpDto } from "@/app/api/auths/route";

export class SignUpUsecase {
  private repository: SbAuthRepository;

  constructor(repository: SbAuthRepository) {
    this.repository = repository;
  }

  async execute(dto: SignUpDto) {
    //여기에 비즈니스 로직 구현 
    return await this.repository.signUp(dto);
  }
}