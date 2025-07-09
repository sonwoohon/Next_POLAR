import { supabase } from '@/lib/supabase';
import { ReviewEntity } from '@/backend/reviews/domains/entities/review';
import { IReviewRepository } from '@/backend/reviews/domains/repositories/ReviewRepository';
import { ReviewMapper } from '@/backend/reviews/infrastructures/mappers/ReviewMapper';

export class SbReviewRepository implements IReviewRepository {
  // helpId로 리뷰 리스트 조회
  async findByHelpId(helpId: number): Promise<ReviewEntity[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('help_id', helpId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data) return [];

    return data.map((row: any) => ReviewMapper.toEntity(row));
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

  // 리뷰 생성
  async create(review: Omit<ReviewEntity, 'id' | 'createdAt'>): Promise<ReviewEntity> {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        help_id: review.helpId,
        writer_id: review.writerId,
        receiver_id: review.receiverId,
        rating: review.rating,
        text: review.text,
      })
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('리뷰 생성 실패');

    return ReviewMapper.toEntity(data);
  }

} 