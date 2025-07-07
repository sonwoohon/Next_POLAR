// 로그인 요청에 사용되는 엔티티(DTO)
// phoneNumber 또는 email 중 하나를 loginId로 사용하며, password를 함께 전달합니다.

import { CommonAuthUser } from '../CommonAuthEntity';

export interface LoginRequest {
  loginId: string; // 전화번호 또는 이메일 (프론트에서 어떤 걸 쓸지 결정)
  password: string; // 비밀번호
}

export interface LoginDBResponse {
  id: number;
  loginId: Pick<CommonAuthUser, 'phoneNumber'> | Pick<CommonAuthUser, 'email'>;
  password: string;
}

export interface LoginResponseDTO {
  user: LoginDBResponse;
  accessToken: string;
  refreshToken: string;
}
