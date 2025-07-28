import { useQuery } from '@tanstack/react-query';
import {
  getHelpList,
  getHelpListWithPagination,
  HelpFilterParams,
} from '@/lib/api_front/help.api';

// 일반 help 리스트 조회 훅 (페이지네이션 없음)
export const useHelpList = (filter?: HelpFilterParams) => {
  return useQuery({
    queryKey: ['helps', 'list', filter],
    queryFn: () => getHelpList(filter),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};

// 페이지네이션이 포함된 help 리스트 조회 훅
export const useHelpListWithPagination = (filter?: HelpFilterParams) => {
  return useQuery({
    queryKey: ['helps', 'list', 'pagination', filter],
    queryFn: () => getHelpListWithPagination(filter),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};

// 날짜별 help 리스트 조회 훅
export const useHelpListByDate = (date: Date | null) => {
  const filter: HelpFilterParams | undefined = date
    ? {
        startDate: date.toISOString().split('T')[0], // YYYY-MM-DD 형식
        endDate: date.toISOString().split('T')[0],
      }
    : undefined;

  return useQuery({
    queryKey: ['helps', 'list', 'date', date?.toISOString().split('T')[0]],
    queryFn: () => getHelpList(filter),
    enabled: !!date, // 날짜가 있을 때만 쿼리 실행
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// 카테고리별 help 리스트 조회 훅
export const useHelpListByCategory = (
  categoryIds?: number[],
  subCategoryIds?: number[]
) => {
  // "전체" 카테고리(0)는 필터링하지 않음
  const hasCategoryFilter = !!(
    (categoryIds?.length && !categoryIds.includes(0)) ||
    (subCategoryIds?.length && !subCategoryIds.includes(0))
  );

  const filter: HelpFilterParams | undefined = hasCategoryFilter
    ? {
        categoryIds: categoryIds?.filter((id) => id !== 0),
        subCategoryIds: subCategoryIds?.filter((id) => id !== 0),
      }
    : undefined;

  return useQuery({
    queryKey: ['helps', 'list', 'category', categoryIds, subCategoryIds],
    queryFn: () => getHelpList(filter),
    enabled: hasCategoryFilter,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// 상태별 help 리스트 조회 훅
export const useHelpListByStatus = (status?: string) => {
  const filter: HelpFilterParams | undefined = status ? { status } : undefined;

  return useQuery({
    queryKey: ['helps', 'list', 'status', status],
    queryFn: () => getHelpList(filter),
    enabled: !!status,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
