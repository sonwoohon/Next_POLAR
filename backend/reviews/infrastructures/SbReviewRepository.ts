import { supabase } from '@/lib/supabase';
import { ReviewEntity } from '@/backend/reviews/domains/entities/review';
import { IReviewRepository } from '@/backend/reviews/domains/repositories/ReviewRepository';

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

    return data.map((row: any) => this.toEntity(row));
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

    return this.toEntity(data);
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

    return this.toEntity(data);
  }

  // DB row → Entity 변환
  private toEntity(row: any): ReviewEntity {
    return new ReviewEntity(
      row.id,
      row.help_id,
      row.writer_id,
      row.receiver_id,
      row.rating,
      row.text,
      new Date(row.created_at)
    );
  }
} 