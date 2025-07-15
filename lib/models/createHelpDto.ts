export interface ApiCreateHelp {
  title: string;
  content: string;
  category: number;
  startDate: string;
  endDate: string;
  imageFiles: string[];
}

export interface ApiCreateHelpImagesRequest {
  imageFiles: File[];
}

export interface ApiCreateHelpResponse {
  id: number;
}

export interface ApiCreateHelpImagesResponse {
  url: string;
}
