'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Image from 'next/image';
import styles from './CreateReview.module.css';

interface UserProfile {
  nickname: string;
  name?: string;
  profileImgUrl?: string;
}

export default function CreateReviewPage({ params }: { params: Promise<{ helpId: string }> }) {
  const { helpId } = use(params);
  const [form, setForm] = useState({
    rating: 5,
    text: '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [receiver, setReceiver] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchReceiver = async () => {
      try {
        // 1. helpId로 헬프 상세 조회
        const helpRes = await fetch(`/api/helps/${helpId}`);
        if (!helpRes.ok) return;
        const helpData = await helpRes.json();
        const seniorNickname = helpData.seniorNickname;
        if (!seniorNickname) return;
        // 2. seniorNickname으로 유저 정보 조회
        const userRes = await fetch(`/api/users/${seniorNickname}`);
        if (!userRes.ok) return;
        const userData = await userRes.json();
        setReceiver(userData);
      } catch (e) {
        // 무시
      }
    };
    fetchReceiver();
  }, [helpId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      if (!helpId) throw new Error('helpId가 없습니다.');

      let reviewImgUrl = undefined;

      // 이미지가 선택된 경우 먼저 업로드
      if (selectedImage) {
        const imageFormData = new FormData();
        imageFormData.append('file', selectedImage);
        
        const imageRes = await fetch('/api/images/review', {
          method: 'POST',
          body: imageFormData,
        });
        
        if (!imageRes.ok) {
          const imageError = await imageRes.json();
          throw new Error(imageError.error || '이미지 업로드 실패');
        }
        
        const imageData = await imageRes.json();
        reviewImgUrl = imageData.url;
      }

      // 리뷰 생성
      const res = await fetch('/api/reviews/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...form, 
          helpId, 
          reviewImgUrl 
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
      <h1 className={styles.title}>리뷰 작성</h1>
      {receiver && (
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', marginBottom:'18px'}}>
          <Image
            src={receiver.profileImgUrl || '/images/dummies/dummy_user.png'}
            alt={receiver.nickname}
            width={80}
            height={80}
            style={{borderRadius:'50%', objectFit:'cover', border:'2px solid #e5e5e5', background:'#fff'}}
          />
          <div style={{marginTop:'10px', fontWeight:700, fontSize:'20px', color:'#222', fontFamily:'var(--font-gangwon)'}}>
            {receiver.name} <span style={{color:'#888', fontSize:'15px'}}>({receiver.nickname})</span>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.ratingSection}>
          <label htmlFor="rating" className={styles.label}>평점</label>
          <input 
            id="rating"
            name="rating" 
            type="number" 
            min={1} 
            max={5} 
            value={form.rating} 
            onChange={handleChange} 
            required 
            className={styles.input} 
          />
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
          <label htmlFor="image" className={styles.label}>이미지 첨부 (선택사항)</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.fileInput}
          />
          {imagePreview && (
            <div className={styles.imagePreview}>
              <Image
                src={imagePreview}
                alt="미리보기"
                width={200}
                height={150}
                className={styles.previewImage}
              />
              <button
                type="button"
                onClick={removeImage}
                className={styles.removeImageButton}
              >
                이미지 제거
              </button>
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? '등록 중...' : '리뷰 등록'}
        </button>
      </form>
      
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>리뷰가 성공적으로 등록되었습니다!</p>}
    </div>
  );
} 