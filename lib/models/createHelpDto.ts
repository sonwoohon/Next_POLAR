export interface ApiCreateHelp {
  title: string;
  content: string;
  category: number;
  startDate: string;
  endDate: string;
  imageFiles: string[];
}

export interface HelpFunnelData {
  types: number[]; // 소분류 ID 배열로 변경
  timeType: string | null;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  content: string;
  imageFiles: string[];
}

export interface ApiCreateHelpImagesRequest {
  formData: FormData;
}

export interface ApiCreateHelpResponse {
  id: number;
}

export interface ApiCreateHelpImagesResponse {
  url: string;
}
