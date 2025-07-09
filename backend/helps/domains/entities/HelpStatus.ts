// Help 상태 정의 (공통 도메인)
export enum HelpStatus {
  OPEN = 'open', // 기본 상태 (시니어가 help 생성)
  CONNECTING = 'connecting', // 주니어 선택됨 (시니어가 주니어 선택)
  CLOSE = 'close', // 닫힘 (시니어가 help 닫음)
  COMPLETED = 'completed', // 완료 (인증 코드 검증 완료)
}

// 상태 전이 규칙
export const STATUS_TRANSITIONS: Record<HelpStatus, HelpStatus[]> = {
  [HelpStatus.OPEN]: [HelpStatus.CONNECTING, HelpStatus.CLOSE],
  [HelpStatus.CONNECTING]: [HelpStatus.COMPLETED],
  [HelpStatus.CLOSE]: [], // 종료 상태
  [HelpStatus.COMPLETED]: [], // 종료 상태
};

// 상태별 설명
export const STATUS_DESCRIPTIONS = {
  [HelpStatus.OPEN]: '지원 대기 중',
  [HelpStatus.CONNECTING]: '주니어와 연결됨',
  [HelpStatus.CLOSE]: '닫힘',
  [HelpStatus.COMPLETED]: '완료됨',
} as const;
