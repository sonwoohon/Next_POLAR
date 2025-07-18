export interface ApiCreateHelp {
  title: string;
  content: string;
  category: number;
  startDate: string;
  endDate: string;
  imageFiles: string[];
}

export interface HelpFunnelData {
  types: string[]; // 여러 타입을 선택할 수 있도록 배열로 변경
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
