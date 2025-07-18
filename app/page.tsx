"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import styles from './Onboarding.module.css';
import { useAuthRedirect } from '@/lib/hooks/useAuthRedirect';
import { useNavigation } from '@/lib/hooks/useNavigation';
import { useOnboardingData } from '@/lib/hooks/useOnboardingData';

export default function Home() {
  // 인증 상태 확인 및 자동 리다이렉트
  const { isAuthenticated } = useAuthRedirect();
  
  // 네비게이션 핸들러
  const { navigateToLogin, navigateToSignup } = useNavigation();
  
  // 온보딩 데이터
  const { slides, swiperConfig } = useOnboardingData();

  return (
    <div className={styles.onboardingWrap}>
      {/* 애니메이션 버블 배경 */}
      <div className={`${styles.bubble} ${styles.bubble1}`}></div>
      <div className={`${styles.bubble} ${styles.bubble2}`}></div>
      <div className={`${styles.bubble} ${styles.bubble3}`}></div>
      <div className={`${styles.bubble} ${styles.bubble4}`}></div>
      <div className={`${styles.bubble} ${styles.bubble5}`}></div>
      {/* Swiper 슬라이드 및 버튼 등 기존 컨텐츠 */}
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={swiperConfig.spaceBetween}
        slidesPerView={swiperConfig.slidesPerView}
        autoplay={swiperConfig.autoplay}
        pagination={swiperConfig.pagination}
        loop={swiperConfig.loop}
        className={styles.swiper}
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className={styles.slideContent}>
              <h2 className={styles.slideTitle}>{slide.title}</h2>
              <p className={styles.slideDesc}>{slide.desc}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className={styles.buttonWrap}>
        <button className={styles.loginBtn} onClick={navigateToLogin}>로그인</button>
        <button className={styles.signupBtn} onClick={navigateToSignup}>회원가입</button>
      </div>
    </div>
  );
}
