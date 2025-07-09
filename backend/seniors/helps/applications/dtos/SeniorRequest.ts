export interface CreateSeniorHelpRequestDto {
  title: string;
  startDate: string;
  content?: string;
  category: number | number[];
  endDate?: string;
}

export interface UpdateSeniorHelpRequestDto {
  id: number;
  title?: string;
  startDate?: string;
  endDate?: string;
  category: number | number[];
  content?: string;
  status?: string;
}
