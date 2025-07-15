// 헬프 이미지 Repository 인터페이스
export interface IHelpImageRepository {
  // 헬프 ID로 이미지 URL 리스트 조회
  getHelpImageUrlsByHelpId(helpId: number): Promise<string[]>;
  
  // 헬프 이미지 URL들 저장 (여러 개)
  saveHelpImageUrls(helpId: number, imageUrls: string[]): Promise<void>;
  
  // 헬프 ID로 모든 이미지 삭제 (헬프 삭제 시 사용)
  deleteAllHelpImagesByHelpId(helpId: number): Promise<boolean>;
} 