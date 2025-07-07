// Junior 사용자 인증 관련 엔티티
// 이 파일에는 Junior 사용자의 인증과 관련된 도메인 엔티티들이 정의됩니다.

// 예시:
// - JuniorUser: Junior 사용자 정보
// - JuniorAuthSession: 인증 세션 정보
// - JuniorAuthCredentials: 로그인 자격 증명
// - JuniorProfile: 사용자 프로필 정보

// 도메인 엔티티는 비즈니스 규칙을 포함하며, 외부 의존성이 없는 순수한 객체여야 합니다.
export interface CommonAuthUser {
  id: number; // 사용자 고유 ID (int8)
  phoneNumber: string; // 전화번호 (varchar)
  password: string; // 비밀번호 (varchar)
  email: string; // 이메일 (varchar)
  age: number; // 나이 (int4)
  profileImgUrl: string; // 프로필 이미지 URL (text)
  address: string; // 주소 (varchar)
  name: string; // 이름 (varchar)
  createdAt: string; // 생성일시 (timestamp, ISO 문자열)
}
