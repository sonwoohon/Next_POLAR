export const getCategoryName = (categoryId: number) => {
  const categories: { [key: number]: string } = {
    6: '짐 나르기',
    7: '청소',
    8: '수확(농경 보조)',
    9: '재난/재해 봉사',
    10: '김장',
    11: '스마트폰 질문',
    12: '대리 상담',
    13: '재능기부',
    14: '가벼운 배달',
    15: '장보기(편의점 등)',
    16: '콘서트 예매',
    17: '가벼운 대화(교감)',
    18: '간단한 상담',
    19: '티켓팅 줄 서기',
  };
  return categories[categoryId] || '기타';
};

export const getCategoryEmoji = (categoryId: number) => {
  const emojis: { [key: number]: string } = {
    6: '📦',
    7: '🧹',
    8: '🌾',
    9: '🚨',
    10: '🥬',
    11: '📱',
    12: '💼',
    13: '🎨',
    14: '📦',
    15: '🛒',
    16: '🎫',
    17: '💬',
    18: '💭',
    19: '🎫',
  };
  return emojis[categoryId] || '✨';
};

export const getCategoryPoint = (categoryId: number) => {
  const points: { [key: number]: number } = {
    6: 5000,
    7: 3000,
    8: 3000,
    9: 10000,
    10: 5000,
    11: 1000,
    12: 3000,
    13: 5000,
    14: 1000,
    15: 3000,
    16: 1000,
    17: 1000,
    18: 3000,
    19: 3000,
  };
  return points[categoryId] || 0;
};

export const getBigCategory = (categoryId: number): string => {
  // 대분류 1: 힘 (6-10)
  if (categoryId >= 6 && categoryId <= 10) return '힘';
  // 대분류 2: 지능 (11-13)
  if (categoryId >= 11 && categoryId <= 13) return '지능';
  // 대분류 3: 매력 (14-16)
  if (categoryId >= 14 && categoryId <= 16) return '매력';
  // 대분류 4: 인내 (17-18)
  if (categoryId >= 17 && categoryId <= 18) return '인내';
  // 대분류 5: 신속 (19)
  if (categoryId === 19) return '신속';
  return '기타';
};

export const getBigCategoryId = (categoryId: number): number => {
  // 대분류 1: 힘 (6-10)
  if (categoryId >= 6 && categoryId <= 10) return 1;
  // 대분류 2: 지능 (11-13)
  if (categoryId >= 11 && categoryId <= 13) return 2;
  // 대분류 3: 매력 (14-16)
  if (categoryId >= 14 && categoryId <= 16) return 3;
  // 대분류 4: 인내 (17-18)
  if (categoryId >= 17 && categoryId <= 18) return 4;
  // 대분류 5: 신속 (19)
  if (categoryId === 19) return 5;
  return 0;
};
