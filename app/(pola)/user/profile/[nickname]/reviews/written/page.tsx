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
  writerProfileImgUrl?: string;
  createdAt: string;
}

interface UserProfile {
  nickname: string;
  name?: string;
  profileImgUrl?: string;
}

export default function WrittenReviewsPage({ params }: { params: Promise<{ nickname: string }> }) {
  const { nickname } = use(params);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        // 유저 정보 fetch
        const userRes = await fetch(`/api/users/${nickname}`);
        let userData = null;
        if (userRes.ok) {
          userData = await userRes.json();
          setUser(userData);
        }
        // 리뷰 fetch
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
    fetchUserAndReviews();
  }, [nickname]);

  if (loading) {
    return <div className={styles.loadingContainer}>로딩 중...</div>;
  }
  if (error) {
    return <div className={styles.errorContainer}>오류: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>쓴리뷰</h2>
      {user && (
        <div className={styles.profileSummary}>
          <Image
            src={user.profileImgUrl || '/images/dummies/dummy_user.png'}
            alt={user.nickname}
            width={80}
            height={80}
            className={styles.profileImageLarge}
          />
          <div className={styles.profileInfoBox}>
            <div className={styles.profileNickname}>{user.name} <span style={{color:'#888', fontSize:'15px'}}>({user.nickname})</span></div>
          </div>
        </div>
      )}
      <div className={styles.reviewCountRow}>
        <span className={styles.reviewCount}>리뷰 {reviews.length}개</span>
      </div>
      {reviews.length === 0 ? (
        <div className={styles.emptyState}>작성한 리뷰가 없습니다.</div>
      ) : (
        <ul className={styles.reviewsList}>
          {reviews.map((review) => (
            <li key={review.id} className={styles.reviewItem}>
              <div className={styles.reviewHeaderRow}>
                <Image
                  src={review.writerProfileImgUrl || '/images/dummies/dummy_user.png'}
                  alt={review.writerNickname}
                  width={40}
                  height={40}
                  className={styles.profileImageCircle}
                />
                <span className={styles.nicknameRow}>
                  <span className={styles.nicknameBold}>{review.writerNickname}</span>
                  <span className={styles.arrow}>&nbsp;&gt;</span>
                </span>
                <span className={styles.stars}>
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </span>
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
              <div className={styles.reviewTextBox}>{review.text}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 