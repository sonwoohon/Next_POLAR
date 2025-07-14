'use client';

// TODO: 현재 uuid를 실제로는 userId 값으로 사용 중이지만, 코드상 uuid 변수/params를 유지합니다. 나중에 진짜 uuid로 전환 시 fetch 쿼리만 uuid로 바꿔주면 됩니다.
import { useEffect, useState } from 'react';
import { use } from 'react';
import styles from '@/app/(pola)/user/profile/[uuid]/reviews/UserReviews.module.css';

interface Review {
  id: number;
  helpId: number;
  writerId: number;
  receiverId: number;
  rating: number;
  text: string;
  createdAt: string;
}

export default function ReceivedReviewsPage({ params }: { params: Promise<{ uuid: string }> }) {
  // params로 uuid를 받지만, 실제 값은 userId임. 나중에 uuid로 전환 시 fetch 쿼리만 바꿔주면 됨.
  const { uuid } = use(params);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        // 현재는 userId로 사용, 나중에 uuid로 전환 시 아래 한 줄만 수정하면 됨
        const response = await fetch(`/api/reviews/received?uuid=${uuid}`);
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
  }, [uuid]);

  if (loading) {
    return <div className={styles.loadingContainer}>로딩 중...</div>;
  }
  if (error) {
    return <div className={styles.errorContainer}>오류: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>받은 리뷰</h2>
      {reviews.length === 0 ? (
        <div className={styles.emptyState}>받은 리뷰가 없습니다.</div>
      ) : (
        <ul className={styles.reviewsList}>
          {reviews.map((review) => (
            <li key={review.id} className={styles.reviewItem}>
              <div className={styles.reviewHeader}>
                <span className={styles.reviewId}>리뷰 #{review.id}</span>
                <span className={styles.rating}>{'⭐'.repeat(review.rating)}</span>
              </div>
              <p className={styles.reviewText}>{review.text}</p>
              <small className={styles.reviewDate}>작성일: {new Date(review.createdAt).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 