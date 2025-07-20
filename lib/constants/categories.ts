// 대분류별 카테고리 상수 정의 (이미지 기준)

export interface Category {
  id: number;
  name: string;
  point: number;
  emoji: string;
}

export interface BigCategory {
  id: number;
  name: string;
  categories: Category[];
}

// 대분류 1: 힘 (6-10)
export const STRENGTH_CATEGORIES: Category[] = [
  { id: 6, name: '짐 나르기', point: 5000, emoji: '📦' },
  { id: 7, name: '청소', point: 3000, emoji: '🧹' },
  { id: 8, name: '수확(농경 보조)', point: 3000, emoji: '🌾' },
  { id: 9, name: '재난/재해 봉사', point: 10000, emoji: '🚨' },
  { id: 10, name: '김장', point: 5000, emoji: '🥬' },
];

// 대분류 2: 지능 (11-13)
export const INTELLIGENCE_CATEGORIES: Category[] = [
  { id: 11, name: '스마트폰 질문', point: 1000, emoji: '📱' },
  { id: 12, name: '대리 상담', point: 3000, emoji: '💼' },
  { id: 13, name: '재능기부', point: 5000, emoji: '🎨' },
];

// 대분류 3: 매력 (14-16)
export const CHARM_CATEGORIES: Category[] = [
  { id: 14, name: '가벼운 배달', point: 1000, emoji: '📦' },
  { id: 15, name: '장보기(편의점 등)', point: 3000, emoji: '🛒' },
  { id: 16, name: '콘서트 예매', point: 1000, emoji: '🎫' },
];

// 대분류 4: 인내 (17-18)
export const PATIENCE_CATEGORIES: Category[] = [
  { id: 17, name: '가벼운 대화(교감)', point: 1000, emoji: '💬' },
  { id: 18, name: '간단한 상담', point: 3000, emoji: '💭' },
];

// 대분류 5: 신속 (19)
export const SPEED_CATEGORIES: Category[] = [
  { id: 19, name: '티켓팅 줄 서기', point: 3000, emoji: '🎫' },
];

// 모든 대분류
export const BIG_CATEGORIES: BigCategory[] = [
  { id: 1, name: '힘', categories: STRENGTH_CATEGORIES },
  { id: 2, name: '지능', categories: INTELLIGENCE_CATEGORIES },
  { id: 3, name: '매력', categories: CHARM_CATEGORIES },
  { id: 4, name: '인내', categories: PATIENCE_CATEGORIES },
  { id: 5, name: '신속', categories: SPEED_CATEGORIES },
];

// 모든 카테고리 (평면화)
export const ALL_CATEGORIES: Category[] = [
  ...STRENGTH_CATEGORIES,
  ...INTELLIGENCE_CATEGORIES,
  ...CHARM_CATEGORIES,
  ...PATIENCE_CATEGORIES,
  ...SPEED_CATEGORIES,
];

// 카테고리 ID로 카테고리 찾기
export const findCategoryById = (id: number): Category | undefined => {
  return ALL_CATEGORIES.find((category) => category.id === id);
};

// 대분류 ID로 대분류 찾기
export const findBigCategoryById = (id: number): BigCategory | undefined => {
  return BIG_CATEGORIES.find((bigCategory) => bigCategory.id === id);
};

// 카테고리 ID로 대분류 찾기
export const findBigCategoryByCategoryId = (
  categoryId: number
): BigCategory | undefined => {
  return BIG_CATEGORIES.find((bigCategory) =>
    bigCategory.categories.some((category) => category.id === categoryId)
  );
};
