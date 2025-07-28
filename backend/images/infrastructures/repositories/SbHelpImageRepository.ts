import { IHelpImageRepository } from '@/backend/images/domains/repositories/IHelpImageRepository';
import { supabase } from '@/backend/common/utils/supabaseClient';

// Supabase 헬프 이미지 Repository 구현체
export class SbHelpImageRepository implements IHelpImageRepository {
  
  // 헬프 ID로 이미지 URL 리스트 조회
  async getHelpImageUrlsByHelpId(helpId: number): Promise<string[]> {

    try {
      const { data, error } = await supabase
        .from('help_images')
        .select('image_url')
        .eq('help_id', helpId);

      if (error) {
        console.error('[SbHelpImageRepository] 헬프 이미지 URL 리스트 조회 실패:', error);
        throw new Error(`헬프 이미지 URL 리스트 조회에 실패했습니다: ${error.message}`);
      }

      const imageUrls = data.map(item => item.image_url);

      return imageUrls;
    } catch (error) {
      console.error('[SbHelpImageRepository] 헬프 이미지 URL 리스트 조회 중 오류 발생:', error);
      throw error;
    }
  }

  // 헬프 이미지 URL들 저장 (여러 개)
  async saveHelpImageUrls(helpId: number, imageUrls: string[]): Promise<void> {

    try {
      const records = imageUrls.map(imageUrl => ({
        help_id: helpId,
        image_url: imageUrl
      }));

      const { error } = await supabase
        .from('help_images')
        .insert(records);

      if (error) {
        console.error('[SbHelpImageRepository] 헬프 이미지 URL들 저장 실패:', error);
        throw new Error(`헬프 이미지 URL들 저장에 실패했습니다: ${error.message}`);
      }

    } catch (error) {
      console.error('[SbHelpImageRepository] 헬프 이미지 URL들 저장 중 오류 발생:', error);
      throw error;
    }
  }

  // 헬프 ID로 모든 이미지 삭제
  async deleteAllHelpImagesByHelpId(helpId: number): Promise<boolean> {

    try {
      const { error } = await supabase
        .from('help_images')
        .delete()
        .eq('help_id', helpId);

      if (error) {
        console.error('[SbHelpImageRepository] 헬프의 모든 이미지 삭제 실패:', error);
        throw new Error(`헬프의 모든 이미지 삭제에 실패했습니다: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('[SbHelpImageRepository] 헬프의 모든 이미지 삭제 중 오류 발생:', error);
      throw error;
    }
  }
} 