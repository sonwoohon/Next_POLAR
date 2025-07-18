export interface HelpDetail {
  id: number;
  title: string;
  representativeImage: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  category: { id: number; point: number }[];
}
