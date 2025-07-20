import { HelpResponseDto } from '@/backend/helps/applications/dtos/HelpDTO';

export interface SeniorHelpsResponseDto {
  success: boolean;
  data: HelpResponseDto[];
  message?: string;
} 