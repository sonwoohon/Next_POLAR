import {
  ALL_CATEGORIES,
  BIG_CATEGORIES,
  Category,
  BigCategory,
} from '../constants/categories';

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

// 카테고리 ID로 카테고리 찾기 (별칭)
export const getCategoryById = (id: number) => {
  return findCategoryById(id);
};

// 대분류 ID로 대분류 찾기 (별칭)
export const getBigCategoryById = (id: number) => {
  return findBigCategoryById(id);
};

// 카테고리 ID로 대분류 찾기 (별칭)
export const getBigCategoryByCategoryId = (categoryId: number) => {
  return findBigCategoryByCategoryId(categoryId);
};

// 카테고리 이름으로 카테고리 찾기
export const getCategoryByName = (name: string) => {
  return ALL_CATEGORIES.find((category) => category.name === name);
};

// 대분류 이름으로 대분류 찾기
export const getBigCategoryByName = (name: string) => {
  return BIG_CATEGORIES.find((bigCategory) => bigCategory.name === name);
};

// 카테고리 ID로 카테고리 이름 가져오기
export const getCategoryName = (id: number): string => {
  const category = findCategoryById(id);
  return category ? category.name : '기타';
};

// 카테고리 ID로 이모지 가져오기
export const getCategoryEmoji = (id: number): string => {
  const category = findCategoryById(id);
  return category ? category.emoji : '❓';
};

// 카테고리 ID로 포인트 가져오기
export const getCategoryPoint = (id: number): number => {
  const category = findCategoryById(id);
  return category ? category.point : 0;
};
