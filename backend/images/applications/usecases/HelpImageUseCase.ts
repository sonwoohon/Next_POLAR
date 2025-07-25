import { IHelpImageRepository } from '@/backend/images/domains/repositories/IHelpImageRepository';
import { IImageRepository } from '@/backend/images/domains/repositories/ImageRepository';
import { UploadImageUseCase } from './ImageUseCase';

// 헬프 이미지 조회 UseCase
export class GetHelpImagesUseCase {
  constructor(private readonly helpImageRepository: IHelpImageRepository) {}

  async execute(helpId: number): Promise<{ images: string[] }> {
    try {
      const imageUrls = await this.helpImageRepository.getHelpImageUrlsByHelpId(
        helpId
      );

      return { images: imageUrls };
    } catch (error) {
      console.error(
        `[GetHelpImagesUseCase] 헬프 이미지 조회 중 오류 발생 - HelpId: ${helpId}`,
        error
      );
      throw error;
    }
  }
}

// 헬프 이미지 업로드 UseCase
export class UploadHelpImagesUseCase {
  constructor(
    private readonly imageRepository: IImageRepository,
    private readonly helpImageRepository: IHelpImageRepository
  ) {}

  async execute(files: File[], helpId: number): Promise<{ urls: string[] }> {
    try {
      const imageUrls: string[] = [];

      // 각 파일을 순차적으로 업로드
      for (const file of files) {
        const uploadUseCase = new UploadImageUseCase(this.imageRepository);
        const uploadResult = await uploadUseCase.execute(
          file,
          'help-images',
          'system'
        ); // 시스템 사용자로 업로드
        imageUrls.push(uploadResult.url);
      }

      // 업로드된 이미지 URL들을 DB에 저장
      await this.helpImageRepository.saveHelpImageUrls(helpId, imageUrls);

      return { urls: imageUrls };
    } catch (error) {
      console.error(
        `[UploadHelpImagesUseCase] 헬프 이미지 업로드 중 오류 발생 - HelpId: ${helpId}`,
        error
      );
      throw error;
    }
  }
}

// 헬프의 모든 이미지 삭제 UseCase (헬프 삭제 시 사용)
export class DeleteAllHelpImagesUseCase {
  constructor(
    private readonly helpImageRepository: IHelpImageRepository,
    private readonly imageRepository: IImageRepository
  ) {}

  async execute(helpId: number): Promise<boolean> {
    try {
      // 1. 헬프 ID로 이미지 URL 리스트 조회
      const imageUrls = await this.helpImageRepository.getHelpImageUrlsByHelpId(
        helpId
      );

      // 2. 각 이미지를 help-images 버킷에서 삭제
      for (const imageUrl of imageUrls) {
        try {
          await this.imageRepository.deleteImage(imageUrl, 'help-images');
        } catch (error) {
          console.error(
            `[DeleteAllHelpImagesUseCase] 이미지 삭제 실패 - URL: ${imageUrl}`,
            error
          );
        }
      }

      // 3. 헬프의 모든 이미지 레코드 삭제
      const success =
        await this.helpImageRepository.deleteAllHelpImagesByHelpId(helpId);

      return success;
    } catch (error) {
      console.error(
        `[DeleteAllHelpImagesUseCase] 헬프의 모든 이미지 삭제 중 오류 발생 - HelpId: ${helpId}`,
        error
      );
      throw error;
    }
  }
}
