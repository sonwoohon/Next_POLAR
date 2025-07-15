'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Image from 'next/image';
import styles from './HelpDetail.module.css';

interface UserProfile {
  nickname: string;
  name?: string;
  profileImgUrl?: string;
  rating?: number;
  job?: string;
  jobIcon?: string;
}

interface HelpDetail {
  id: number;
  title: string;
  content: string;
  startDate: Date;
  endDate: Date;
  seniorNickname: string;
  status: string;
}

export default function HelpDetailPage({ params }: { params: Promise<{ helpId: string }> }) {
  const { helpId } = use(params);
  const [help, setHelp] = useState<HelpDetail | null>(null);
  const [senior, setSenior] = useState<UserProfile | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // 임시: 사용자 나이 설정 (실제로는 쿠키에서 가져올 예정)
  const userAge = 28; // 25세 (주니어) - 실제로는 getAgeFromCookie() 등으로 교체
  
  // 주니어/시니어 판별 (25세 이하: 주니어, 26세 이상: 시니어)
  const isJunior = userAge <= 25;
  const isSenior = userAge >= 26;

  useEffect(() => {
    const fetchHelpDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 헬프 상세 정보 조회
        const helpRes = await fetch(`/api/helps/${helpId}`);
        if (!helpRes.ok) throw new Error('헬프 정보를 불러오지 못했습니다.');
        const helpData = await helpRes.json();
        setHelp(helpData);
        
        // 시니어 정보 조회
        const seniorRes = await fetch(`/api/users/${helpData.seniorNickname}`);
        if (!seniorRes.ok) throw new Error('시니어 정보를 불러오지 못했습니다.');
        const seniorData = await seniorRes.json();
        setSenior(seniorData);
        
        // 헬프 이미지 리스트 조회
        const imagesRes = await fetch(`/api/images/help/${helpId}`);
        if (imagesRes.ok) {
          const imagesData = await imagesRes.json();
          setImages(imagesData.images || []);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : '알 수 없는 오류');
      } finally {
        setLoading(false);
      }
    };
    fetchHelpDetail();
  }, [helpId]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className={styles.loadingContainer}>로딩 중...</div>;
  }
  if (error) {
    return <div className={styles.errorContainer}>오류: {error}</div>;
  }

  return (
    <div className={styles.helpDetailContainer}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.logo}>POLAR</div>
        <div className={styles.topButtons}>
          <button className={styles.closeButton}>✕</button>
          <button className={styles.heartButton}>♡</button>
        </div>
      </div>



      {/* Image Carousel */}
      <div className={styles.imageSection}>
        {images.length > 0 ? (
          <>
            <div className={styles.imageContainer}>
              <Image
                src={images[currentImageIndex]}
                alt={`헬프 이미지 ${currentImageIndex + 1}`}
                fill
                className={styles.helpImage}
                onError={(e) => {
                  // 이미지 로드 실패 시 빈칸으로 처리
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
            {images.length > 1 && (
              <>
                {/* 이전 버튼 */}
                <button 
                  className={styles.slideButton} 
                  onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}
                  style={{ left: '10px' }}
                >
                  ‹
                </button>
                {/* 다음 버튼 */}
                <button 
                  className={styles.slideButton} 
                  onClick={() => setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}
                  style={{ right: '10px' }}
                >
                  ›
                </button>
                {/* 닷 인디케이터 */}
                <div className={styles.imageDots}>
                  {images.map((_, index) => (
                    <div
                      key={index}
                      className={`${styles.dot} ${index === currentImageIndex ? styles.activeDot : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className={styles.imagePlaceholder}>
            <div className={styles.mountainIcon}>🏔️</div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {help && (
          <>
            <h1 className={styles.helpTitle}>{help.title}</h1>
            
            {/* Senior Profile */}
            {senior && (
              <div className={styles.profileArea}>
                <Image
                  src={senior.profileImgUrl || '/images/dummies/dummy_user.png'}
                  alt={senior.nickname}
                  width={80}
                  height={80}
                  className={styles.profileImage}
                />
                <div className={styles.profileName}>
                  {senior.name} <span className={styles.profileNickname}>({senior.nickname})</span>
                </div>
              </div>
            )}

            {/* Help Period */}
            <div className={styles.helpPeriod}>
              {help && `${formatDate(help.startDate)} ~ ${formatDate(help.endDate)}`}
            </div>

            {/* Help Content */}
            <div className={styles.helpContent}>
              {help.content}
            </div>
          </>
        )}
      </div>

      {/* Bottom Action Button */}
      <div className={styles.bottomButtonContainer}>
        {isJunior ? (
          <button className={styles.applyButton}>
            <span className={styles.plusIcon}>+</span>
            헬프 지원하기
          </button>
        ) : isSenior ? (
          <button className={styles.applyButton}>
            <span className={styles.checkIcon}>👥</span>
            지원자 확인하기
          </button>
        ) : null}
      </div>
    </div>
  );
}
