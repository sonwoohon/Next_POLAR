export interface CreateHelpRequest {
  title: string;
  start_date: string;
  end_date?: string;
  category_id: number;
  content?: string;
}

export interface UpdateHelpRequestWithHelpId {
  helpId: number;
  title: string;
  startDate: string;
  content?: string;
  category: number | number[];
  endDate?: string;
}
