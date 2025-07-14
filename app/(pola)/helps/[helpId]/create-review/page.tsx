'use client';

import { useState } from 'react';
import { use } from 'react';
import styles from './CreateReview.module.css';

export default function CreateReviewPage({ params }: { params: Promise<{ helpId: string }> }) {
  const { helpId } = use(params);
  const [form, setForm] = useState({
    rating: 5,
    text: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
      const res = await fetch('/api/reviews/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, helpId }),
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
      <h1 className={styles.title}>리뷰 작성</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input name="rating" type="number" min={1} max={5} value={form.rating} onChange={handleChange} required className={styles.input} />
        <textarea name="text" placeholder="리뷰 내용" value={form.text} onChange={handleChange} required className={styles.textarea} />
        <button type="submit" disabled={loading} className={styles.button}>리뷰 등록</button>
      </form>
      {loading && <p className={styles.status}>등록 중...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>리뷰가 성공적으로 등록되었습니다!</p>}
    </div>
  );
} 