// 헬프 리스트 응답 DTO
export interface HelpListResponseDto {
  id: number;
  seniorInfo: {
    id: number;
    //기타 해당 헬프 작성한 시니어 정보 갖고오기.
  }
  title: string;
  startDate: Date;
  endDate: Date;
  category: number;
  content: string;
  status: string;
  createdAt: Date;
}