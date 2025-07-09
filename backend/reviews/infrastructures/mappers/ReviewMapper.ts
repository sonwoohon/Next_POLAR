import { ReviewEntity } from '@/backend/reviews/domains/entities/review';

export class ReviewMapper {
  static toEntity(row: any): ReviewEntity {
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