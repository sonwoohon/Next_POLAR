import { IImageRepository } from '@/backend/images/domains/repositories/ImageRepository';
import { supabase } from '@/backend/common/utils/supabaseClient';

export class SbImageRepository implements IImageRepository {
  async uploadImage(
    file: File,
    bucketName: string,
    nickname: string
  ): Promise<{ url: string }> {
    try {
      // 파일명 생성 (중복 방지)
      const fileExtension = file.name.split('.').pop();
      const fileName = `${bucketName}_${nickname}_${Date.now()}.${fileExtension}`;

      // Supabase Storage에 업로드
      const { error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error(
          `[SbImageRepository] 업로드 실패 - Bucket: ${bucketName}, Nickname: ${nickname}`,
          error
        );
        throw new Error(`이미지 업로드에 실패했습니다: ${error.message}`);
      }

      // 공개 URL 생성
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      return { url: publicUrl };
    } catch (error) {
      console.error(
        `[SbImageRepository] 이미지 업로드 중 오류 발생 - Bucket: ${bucketName}, Nickname: ${nickname}`,
        error
      );
      throw error;
    }
  }

  async getImageByUrl(
    imageUrl: string,
    bucketName: string
  ): Promise<{ url: string } | null> {
    try {
      // URL에서 파일명 추출
      const fileName = this.extractFileNameFromUrl(imageUrl);
      if (!fileName) {
        console.warn(`[SbImageRepository] 파일명 추출 실패 - URL: ${imageUrl}`);
        return null;
      }

      // Supabase Storage에서 파일 정보 조회
      const { data, error } = await supabase.storage.from(bucketName).list('', {
        search: fileName,
      });

      if (error) {
        console.error(
          `[SbImageRepository] 조회 실패 - 파일명: ${fileName}, Bucket: ${bucketName}`,
          error
        );
        return null;
      }

      if (!data || data.length === 0) {
        return null;
      }

      return { url: imageUrl };
    } catch (error) {
      console.error(
        `[SbImageRepository] 이미지 조회 중 오류 발생 - URL: ${imageUrl}, Bucket: ${bucketName}`,
        error
      );
      return null;
    }
  }

  async deleteImage(imageUrl: string, bucketName: string): Promise<boolean> {
    try {
      // URL에서 파일명 추출
      const fileName = this.extractFileNameFromUrl(imageUrl);
      if (!fileName) {
        console.warn(`[SbImageRepository] 파일명 추출 실패 - URL: ${imageUrl}`);
        return false;
      }

      // Supabase Storage에서 파일 삭제
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([fileName]);

      if (error) {
        console.error(
          `[SbImageRepository] 삭제 실패 - 파일명: ${fileName}, Bucket: ${bucketName}`,
          error
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error(
        `[SbImageRepository] 이미지 삭제 중 오류 발생 - URL: ${imageUrl}, Bucket: ${bucketName}`,
        error
      );
      return false;
    }
  }

  private extractFileNameFromUrl(url: string): string | null {
    try {
      // URL에서 파일명 추출
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];

      // 쿼리 파라미터 제거
      return fileName.split('?')[0];
    } catch (error) {
      console.error(
        `[SbImageRepository] URL에서 파일명 추출 실패 - URL: ${url}`,
        error
      );
      return null;
    }
  }
}
