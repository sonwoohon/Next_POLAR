'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import Image from 'next/image';
import styles from '@/app/(pola)/user/profile/[nickname]/reviews/UserReviews.module.css';

interface Review {
  id: number;
  helpId: number;
  writerNickname: string;
  receiverNickname: string;
  rating: number;
  text: string;
  reviewImgUrl?: string;
  createdAt: string;
}

export default function WrittenReviewsPage({ params }: { params: Promise<{ nickname: string }> }) {
  const { nickname } = use(params);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/reviews/written?nickname=${nickname}`);
        if (!response.ok) throw new Error('리뷰를 불러오는데 실패했습니다.');
        const data = await response.json();
        if (data.success) {
          setReviews(data.reviews);
        } else {
          throw new Error(data.error || '리뷰를 불러오는데 실패했습니다.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [nickname]);

  if (loading) {
    return <div className={styles.loadingContainer}>로딩 중...</div>;
  }
  if (error) {
    return <div className={styles.errorContainer}>오류: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>작성한 리뷰</h2>
      <p className={styles.nickname}>사용자: {nickname}</p>
      {reviews.length === 0 ? (
        <div className={styles.emptyState}>작성한 리뷰가 없습니다.</div>
      ) : (
        <ul className={styles.reviewsList}>
          {reviews.map((review) => (
            <li key={review.id} className={styles.reviewItem}>
              <div className={styles.reviewHeader}>
                <span className={styles.reviewId}>리뷰 #{review.id}</span>
                <span className={styles.rating}>{'⭐'.repeat(review.rating)}</span>
              </div>
              {review.reviewImgUrl && (
                <div className={styles.reviewImageContainer}>
                  <Image
                    src={review.reviewImgUrl}
                    alt={`Review image for review ${review.id}`}
                    width={100}
                    height={100}
                    className={styles.reviewImage}
                  />
                </div>
              )}
              <p className={styles.reviewText}>{review.text}</p>
              <div className={styles.reviewInfo}>
                <small className={styles.reviewDate}>
                  받은 사람: {review.receiverNickname}
                </small>
                <br />
                <small className={styles.reviewDate}>
                  작성일: {new Date(review.createdAt).toLocaleDateString()}
                </small>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 