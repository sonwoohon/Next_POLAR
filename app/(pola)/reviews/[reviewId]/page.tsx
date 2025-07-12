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

export default function ReviewDetailPage({ 
  params 
}: { 
  params: Promise<{ reviewId: string }> 
}) {
  const { reviewId } = use(params);
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/reviews/${reviewId}`);
        
        if (!response.ok) {
          throw new Error('리뷰를 불러오는데 실패했습니다.');
        }
        
        const data = await response.json();
        if (data.success) {
          setReview(data.review);
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

    fetchReview();
  }, [reviewId]);

  if (loading) {
    return (
      <div>
        <h1>리뷰 상세보기</h1>
        <p>리뷰 ID: {reviewId}</p>
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>리뷰 상세보기</h1>
        <p>리뷰 ID: {reviewId}</p>
        <p>오류: {error}</p>
        <button onClick={() => window.location.reload()}>다시 시도</button>
      </div>
    );
  }

  if (!review) {
    return (
      <div>
        <h1>리뷰 상세보기</h1>
        <p>리뷰 ID: {reviewId}</p>
        <p>리뷰를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>리뷰 상세보기</h1>
      <p>리뷰 ID: {reviewId}</p>
      
      {/* 리뷰 상세 정보 */}
      <div>
        <h2>리뷰 정보</h2>
        <div>
          <p>평점: {'⭐'.repeat(review.rating)}</p>
          <p>리뷰 내용: {review.text}</p>
          <p>작성일: {new Date(review.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      
      {/* 관련 도움 요청 정보 */}
      <div>
        <h2>관련 도움 요청</h2>
        <div>
          <p>도움 요청 ID: #{review.helpId}</p>
        </div>
      </div>
      
      {/* 작성자 정보 */}
      <div>
        <h2>작성자 정보</h2>
        <div>
          <a href={`/user/profile/${review.writerId}`}>작성자 프로필 보기</a>
        </div>
      </div>
      
      {/* 뒤로가기 버튼 */}
      <div>
        <button onClick={() => window.history.back()}>
          뒤로가기
        </button>
      </div>
    </div>
  );
} 