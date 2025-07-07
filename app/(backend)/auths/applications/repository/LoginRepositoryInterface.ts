// 로그인 Repository 인터페이스

import { LoginDBResponse } from '../../domains/entities/login/LoginRequest';

// 도메인 계층과 인프라스트럭처 계층 간의 결합도를 낮추기 위한 추상화
export interface LoginRepositoryInterface {
  /**
   * 로그인 ID(전화번호 또는 이메일)로 사용자를 조회합니다.
   * @param loginId - 전화번호(문자열) 또는 이메일
   * @returns 사용자 정보 또는 null (사용자가 존재하지 않는 경우)
   */
  findUserByLoginId(loginId: string): Promise<LoginDBResponse | null>;
}
