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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    <>
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
        <div className={styles.imagePlaceholder}>
          <div className={styles.mountainIcon}>🏔️</div>
        </div>
        <div className={styles.imageDots}>
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className={`${styles.dot} ${index === currentImageIndex ? styles.activeDot : ''}`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
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
              헬프시작일 ~ 끝나는일
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
        <button className={styles.applyButton}>
          <span className={styles.plusIcon}>+</span>
          헬프 지원하기
        </button>
      </div>
    </>
  );
}
