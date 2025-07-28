import { CATEGORY_TITLES, CategoryName } from '@/lib/constants/userProfile';

// 점수 데이터 타입 정의
export interface ScoreData {
  nickname: string;
  categoryId: number;
  season: number;
  categoryScore: number;
  updatedAt: string;
}

// 카테고리 정보 타입 정의
export interface CategoryInfo {
  name: string;
  points: number;
}

// 대분류별 점수 계산
export const calculateBigCategoryScores = (scores: ScoreData[]) => {
  const bigCategoryScores = {
    1: 0, // 힘
    2: 0, // 민첩
    3: 0, // 지능
    4: 0, // 매력
    5: 0, // 인내
  };

  scores?.forEach((score) => {
    const categoryId = score.categoryId;
    if (categoryId >= 1 && categoryId <= 5) {
      bigCategoryScores[categoryId as keyof typeof bigCategoryScores] =
        score.categoryScore;
    }
  });

  return bigCategoryScores;
};

// 가장 높은 점수를 가진 카테고리 찾기
export const getHighestCategory = (helpCategories: CategoryInfo[]) => {
  let highestCategory = helpCategories[0];
  helpCategories.forEach((category) => {
    if (category.points > highestCategory.points) {
      highestCategory = category;
    }
  });
  return highestCategory;
};

// 카테고리별 칭호 생성
export const getRepresentativeTitle = (
  categoryName: string,
  points: number
) => {
  const categoryTitles =
    CATEGORY_TITLES[categoryName as CategoryName] || CATEGORY_TITLES['힘'];
  const titleIndex = Math.floor(points / 1000) % categoryTitles.length;
  return categoryTitles[titleIndex];
};

// 카테고리별 CSS 클래스 반환
export const getCategoryClass = (
  categoryName: string,
  styles: Record<string, string>
): string => {
  switch (categoryName) {
    case '힘':
      return styles.categoryBadgeStrength;
    case '민첩':
      return styles.categoryBadgeAgility;
    case '지능':
      return styles.categoryBadgeIntelligence;
    case '매력':
      return styles.categoryBadgeCharm;
    case '인내':
      return styles.categoryBadgeEndurance;
    default:
      return '';
  }
};
