'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';

interface Review {
  id: number;
  helpId: number;
  writerId: number;
  receiverId: number;
  rating: number;
  text: string;
  createdAt: string;
}

export default function UserReviewsPage({ params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = use(params);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        // UUID를 userId로 사용하여 API 호출
        const response = await fetch(`/api/reviews?userId=${uuid}`);
        
        if (!response.ok) {
          throw new Error('리뷰를 불러오는데 실패했습니다.');
        }
        
        const data = await response.json();
        if (data.success) {
          setReviews(data.reviews);
        } else {
          throw new Error(data.error || '리뷰를 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('리뷰 조회 오류:', err);
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [uuid]);

  if (loading) {
    return (
      <div>
        <h1>유저 리뷰 목록</h1>
        <p>UUID: {uuid}</p>
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>유저 리뷰 목록</h1>
        <p>UUID: {uuid}</p>
        <p>오류: {error}</p>
        <button onClick={() => window.location.reload()}>다시 시도</button>
      </div>
    );
  }

  return (
    <div>
      <h1>유저 리뷰 목록</h1>
      <p>UUID: {uuid}</p>
      
      {reviews.length === 0 ? (
        <p>받은 리뷰가 없습니다.</p>
      ) : (
        <div>
          <h2>받은 리뷰 목록 ({reviews.length}개)</h2>
          <ul>
            {reviews.map((review) => (
              <li key={review.id}>
                <a href={`/reviews/${review.id}`}>
                  리뷰 #{review.id} - 평점: {'⭐'.repeat(review.rating)}
                </a>
                <p>{review.text}</p>
                <small>작성일: {new Date(review.createdAt).toLocaleDateString()}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <a href={`/user/profile/${uuid}`}>프로필로 돌아가기</a>
    </div>
  );
} 