import { ApiResponse } from '../models/common/ApiDto';

/**
 * ApiResponse에서 실제 데이터만 추출하는 유틸리티 함수
 * @param apiResponse ApiResponse<T> 타입의 응답
 * @returns T 타입의 실제 데이터 또는 undefined
 */
export function extractData<T>(
  apiResponse: ApiResponse<T> | undefined
): T | undefined {
  return apiResponse?.data;
}
