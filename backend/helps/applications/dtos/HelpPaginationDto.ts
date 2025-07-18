import { HelpListResponseDto } from './HelpDTO';

export interface HelpPaginationResponseDto {
  data: HelpListResponseDto[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
