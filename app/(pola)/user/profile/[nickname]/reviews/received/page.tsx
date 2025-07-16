'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import Image from 'next/image';
import styles from '@/app/(pola)/user/profile/[nickname]/reviews/UserReviews.module.css';
import ProfileSummary from '../_components/ProfileSummary';
import ReviewCard from '../_components/ReviewCard';

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

export default function ReceivedReviewsPage({ params }: { params: Promise<{ nickname: string }> }) {
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
        const response = await fetch(`/api/reviews/received?nickname=${nickname}`);
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
      <h2 className={styles.title}>받은리뷰</h2>
      {user && <ProfileSummary user={user} />}
      <div className={styles.reviewCountRow}>
        <span className={styles.reviewCount}>리뷰 {reviews.length}개</span>
      </div>
      {reviews.length === 0 ? (
        <div className={styles.emptyState}>받은 리뷰가 없습니다.</div>
      ) : (
        <ul className={styles.reviewsList}>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </ul>
      )}
    </div>
  );
} 