// 이미지 업로드 요청 DTO (FormData)
export type UploadImageRequestDto = {
  file: File;
};

// 이미지 조회 요청 DTO (Query Parameters)
export type GetImageRequestDto = {
  url: string;
  bucketName: string;
};

// 이미지 삭제 요청 DTO (Query Parameters)
export type DeleteImageRequestDto = {
  url: string;
  bucketName: string;
};

// 프로필 이미지 업데이트 요청 DTO
export type UpdateProfileImageRequestDto = {
  file: File;
  userId: number;
}; 