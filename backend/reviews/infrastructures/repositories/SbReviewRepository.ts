import { supabase } from '@/backend/common/utils/supabaseClient';
import { ReviewMapper } from '@/backend/reviews/infrastructures/mappers/ReviewMapper';
import { IReviewRepository } from '@/backend/reviews/domains/repositories/ReviewRepository';
import { ReviewEntity } from '@/backend/reviews/domains/entities/review';

export class SbReviewRepository implements IReviewRepository {
  // nickname으로 받은 리뷰 리스트 조회
  async findByReceiverNickname(nickname: string): Promise<ReviewEntity[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('receiver_nickname', nickname)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data) return [];

    return data.map((review) => ReviewMapper.toEntity(review));
  }

  // nickname으로 내가 쓴(작성한) 리뷰 리스트 조회
  async findByWriterNickname(nickname: string): Promise<ReviewEntity[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('writer_nickname', nickname)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data) return [];

    return data.map((review) => ReviewMapper.toEntity(review));
  }

  // 리뷰 id로 단일 리뷰 상세 조회
  async findById(reviewId: number): Promise<ReviewEntity | null> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', reviewId)
      .single();

    if (error) throw error;
    if (!data) return null;

    return ReviewMapper.toEntity(data);
  }

  // nickname 기반 리뷰 생성
  async createByNicknames(request: any): Promise<ReviewEntity> {
    const { helpId, writerNickname, receiverNickname, rating, text, reviewImgUrl } = request;
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        help_id: helpId,
        writer_nickname: writerNickname,
        receiver_nickname: receiverNickname,
        rating,
        text,
        review_img_url: reviewImgUrl,
      })
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('리뷰 생성 실패');

    return ReviewMapper.toEntity(data);
  }
}
