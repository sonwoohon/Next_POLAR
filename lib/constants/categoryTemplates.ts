// 대분류별 카테고리 템플릿 상수 (이미지 기준)

export interface CategoryTemplate {
  titles: string[];
  contents: string[];
}

// 대분류 1: 힘
export const STRENGTH_TEMPLATES: Record<number, CategoryTemplate> = {
  6: {
    // 짐 나르기
    titles: ['짐 나르기 도와주세요', '이사 짐 정리 도움', '무거운 물건 운반'],
    contents: [
      '이사 준비로 짐이 많아서 도움이 필요해요. 무거운 박스들을 차에 실어주시면 감사하겠습니다.',
      '가구 이동이 필요합니다. 2층에서 1층으로 내려주시면 됩니다.',
      '창고 정리 중인데 무거운 물건들을 옮기는 데 도움이 필요합니다.',
    ],
  },
  7: {
    // 청소
    titles: ['청소 도와주세요', '집 정리 도움', '대청소 함께'],
    contents: [
      '집 청소가 필요합니다. 바닥 청소와 창문 닦기를 도와주세요.',
      '이사 후 정리가 필요합니다. 쓰레기 분리수거와 청소를 도와주세요.',
      '주방 청소가 필요합니다. 설거지와 정리를 도와주세요.',
    ],
  },
  8: {
    // 수확
    titles: ['농작물 수확 도움', '텃밭 정리', '과일 따기'],
    contents: [
      '텃밭의 채소들을 수확하는 데 도움이 필요합니다.',
      '과일나무에서 과일을 따는 것을 도와주세요.',
      '농작물 수확과 정리를 도와주세요.',
    ],
  },
  9: {
    // 재난/재해 봉사
    titles: ['재난 복구 도움', '피해 복구 지원', '봉사활동'],
    contents: [
      '재난 피해 복구 작업에 도움이 필요합니다.',
      '피해 지역 정리 작업을 도와주세요.',
      '재해 복구 봉사활동에 참여해주세요.',
    ],
  },
  10: {
    // 김장
    titles: ['김장 도와주세요', '김치 담그기', '김장 준비'],
    contents: [
      '김장 준비를 도와주세요. 배추 씻기와 양념 준비를 도와주세요.',
      '김치 담그기를 도와주세요. 양념 만들기와 담그기를 도와주세요.',
      '김장 준비가 필요합니다. 배추 준비와 양념 만들기를 도와주세요.',
    ],
  },
};

// 대분류 2: 지능
export const INTELLIGENCE_TEMPLATES: Record<number, CategoryTemplate> = {
  11: {
    // 스마트폰 질문
    titles: ['스마트폰 사용법', '앱 사용 도움', '기술 문의'],
    contents: [
      '스마트폰 사용법을 알려주세요. 앱 설치와 사용법을 도와주세요.',
      '카카오톡 사용법을 알려주세요. 친구 추가와 메시지 보내기를 도와주세요.',
      '인터넷 뱅킹 사용법을 알려주세요. 계좌 조회와 이체 방법을 도와주세요.',
    ],
  },
  12: {
    // 대리 상담
    titles: ['대리 상담', '문의 대신', '상담 도움'],
    contents: [
      '공공기관 상담을 대신 해주세요. 전화 상담을 도와주세요.',
      '병원 예약 상담을 대신 해주세요. 예약 방법을 알려주세요.',
      '은행 상담을 대신 해주세요. 계좌 개설 방법을 알려주세요.',
    ],
  },
  13: {
    // 재능기부
    titles: ['재능 기부', '강의 도움', '교육 지원'],
    contents: [
      '컴퓨터 사용법을 가르쳐주세요. 기초부터 차근차근 알려주세요.',
      '영어 기초를 가르쳐주세요. 간단한 회화를 도와주세요.',
      '악기 연주를 가르쳐주세요. 기타나 피아노 기초를 알려주세요.',
    ],
  },
};

// 대분류 3: 매력
export const CHARM_TEMPLATES: Record<number, CategoryTemplate> = {
  14: {
    // 가벼운 배달
    titles: ['가벼운 배달', '물건 전달', '소포 배송'],
    contents: [
      '가벼운 소포를 배달해주세요. 인근 지역으로 전달해주세요.',
      '문서를 전달해주세요. 같은 동네에 있는 곳으로 전달해주세요.',
      '작은 물건을 배달해주세요. 가까운 거리 배달입니다.',
    ],
  },
  15: {
    // 장보기
    titles: ['장보기 도움', '편의점 쇼핑', '식료품 구매'],
    contents: [
      '편의점에서 장보기를 도와주세요. 간단한 식료품을 사와주세요.',
      '마트에서 장보기를 도와주세요. 필요한 식료품을 사와주세요.',
      '식료품 구매를 도와주세요. 필요한 물건들을 사와주세요.',
    ],
  },
  16: {
    // 콘서트 예매
    titles: ['콘서트 예매', '티켓 예매', '공연 예약'],
    contents: [
      '콘서트 티켓 예매를 도와주세요. 온라인 예매 방법을 알려주세요.',
      '공연 티켓 예매를 도와주세요. 예매 사이트 사용법을 알려주세요.',
      '티켓 예매를 도와주세요. 인터넷 예매 방법을 알려주세요.',
    ],
  },
};

// 대분류 4: 인내
export const PATIENCE_TEMPLATES: Record<number, CategoryTemplate> = {
  17: {
    // 가벼운 대화
    titles: ['대화 상대', '이야기 상대', '교감'],
    contents: [
      '대화 상대가 필요합니다. 가벼운 이야기를 나누어주세요.',
      '이야기 상대를 찾습니다. 일상적인 대화를 나누어주세요.',
      '교감할 수 있는 상대가 필요합니다. 편안한 대화를 나누어주세요.',
    ],
  },
  18: {
    // 간단한 상담
    titles: ['간단한 상담', '고민 상담', '조언'],
    contents: [
      '간단한 고민 상담을 도와주세요. 조언을 구하고 싶습니다.',
      '일상적인 고민을 상담해주세요. 경험담을 들려주세요.',
      '생활 상담을 도와주세요. 조언을 구하고 싶습니다.',
    ],
  },
};

// 대분류 5: 신속
export const SPEED_TEMPLATES: Record<number, CategoryTemplate> = {
  19: {
    // 티켓팅 줄 서기
    titles: ['티켓팅 줄 서기', '예매 대기', '줄 서기'],
    contents: [
      '티켓팅 줄 서기를 도와주세요. 공연 티켓을 구매해주세요.',
      '예매 대기를 도와주세요. 티켓 예매를 도와주세요.',
      '줄 서기를 도와주세요. 티켓 구매를 도와주세요.',
    ],
  },
};

// 모든 템플릿 통합
export const ALL_CATEGORY_TEMPLATES: Record<number, CategoryTemplate> = {
  ...STRENGTH_TEMPLATES,
  ...INTELLIGENCE_TEMPLATES,
  ...CHARM_TEMPLATES,
  ...PATIENCE_TEMPLATES,
  ...SPEED_TEMPLATES,
};

// 기존 템플릿을 새로운 구조로 교체
export const CATEGORY_TEMPLATES: Record<number, CategoryTemplate> =
  ALL_CATEGORY_TEMPLATES;

// 유틸리티 함수들
export const getCategoryTemplate = (
  categoryId: number
): CategoryTemplate | null => {
  return CATEGORY_TEMPLATES[categoryId] || null;
};

export const getRandomTitle = (categoryId: number): string => {
  const template = getCategoryTemplate(categoryId);
  if (!template || template.titles.length === 0) return '도움이 필요합니다';

  const randomIndex = Math.floor(Math.random() * template.titles.length);
  return template.titles[randomIndex];
};

export const getRandomContent = (categoryId: number): string => {
  const template = getCategoryTemplate(categoryId);
  if (!template || template.contents.length === 0) return '도움이 필요합니다.';

  const randomIndex = Math.floor(Math.random() * template.contents.length);
  return template.contents[randomIndex];
};
