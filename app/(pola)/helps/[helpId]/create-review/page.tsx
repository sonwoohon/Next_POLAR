'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Image from 'next/image';
import styles from './CreateReview.module.css';
import ProfileCard from '@/app/_components/ProfileCard';
import ImageUploader from '@/app/_components/commons/imageUploader/ImageUploader';

interface UserProfile {
  nickname: string;
  name?: string;
  profileImgUrl?: string;
}

export default function CreateReviewPage({ params }: { params: Promise<{ helpId: string }> }) {
  const { helpId } = use(params);
  const [form, setForm] = useState({
    rating: 0,
    text: '',
  });
  const [reviewImgUrl, setReviewImgUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hover, setHover] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      if (!helpId) throw new Error('helpId가 없습니다.');

      // 리뷰 생성
      const res = await fetch('/api/reviews/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...form, 
          helpId, 
          reviewImgUrl // ImageUploader에서 받아온 url 사용
        }),
      });
      
      const data = await res.json();
      if (!data.success) throw new Error(data.error || '리뷰 생성 실패');
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.loadingContainer}>로딩 중...</div>
      ) : error ? (
        <div className={styles.errorContainer}>오류: {error}</div>
      ) : (
        <>
          <h1 className={styles.title}>리뷰 작성</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.ratingSection}>
              <label className={styles.label}>평점</label>
              <div className={styles.ratingStars}>
                {[1,2,3,4,5].map((star) => (
                  <span
                    key={star}
                    className={`${styles.star} ${(hover || form.rating) >= star ? styles.filled : ''}`}
                    onClick={() => setForm({ ...form, rating: star })}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    style={{ cursor: 'pointer' }}
                    aria-label={`${star}점`}
                  >
                    {(hover || form.rating) >= star ? '★' : '☆'}
                  </span>
                ))}
              </div>
            </div>
            
            <div className={styles.textSection}>
              <label htmlFor="text" className={styles.label}>리뷰 내용</label>
              <textarea 
                id="text"
                name="text" 
                placeholder="리뷰 내용을 작성해주세요" 
                value={form.text} 
                onChange={handleChange} 
                required 
                className={styles.textarea} 
              />
            </div>

            <div className={styles.imageSection}>
              <label className={styles.label}>이미지 첨부 (선택사항)</label>
              <ImageUploader onUploadSuccess={setReviewImgUrl} />
            </div>

            <button type="submit" disabled={loading} className={styles.button}>
              {loading ? '등록 중...' : '리뷰 등록'}
            </button>
          </form>
          
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>리뷰가 성공적으로 등록되었습니다!</p>}
        </>
      )}
    </div>
  );
} 