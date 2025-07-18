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
              
              {/* 슬라이드별 인터랙션 요소 */}
              <div className={styles.slideInteraction}>
                {idx === 0 && (
                  <div className={styles.interactionConnect}>
                    <div className={styles.personSenior}>👴</div>
                    <div className={styles.connectionLine}></div>
                    <div className={styles.personJunior}>👨‍🎓</div>
                  </div>
                )}
                
                {idx === 1 && (
                  <div className={styles.interactionGrowth}>
                    <div className={styles.requestIcon}>📝</div>
                    <div className={styles.arrowDown}>↓</div>
                    <div className={styles.experienceIcon}>💡</div>
                  </div>
                )}
                
                {idx === 2 && (
                  <div className={styles.interactionReward}>
                    <div className={styles.helpIcon}>🤝</div>
                    <div className={styles.trophyIcon}>🏆</div>
                    <div className={styles.equalsIcon}>=</div>
                    <img src="/images/logos/POLAR.png" alt="POLAR 로고" className={styles.polarLogo} />
                  </div>
                )}
                
                {idx === 3 && (
                  <div className={styles.interactionSafety}>
                    <div className={styles.shieldIcon}>🛡️</div>
                    <div className={styles.chatIcon}>💬</div>
                    <div className={styles.checkIcon}>✅</div>
                  </div>
                )}
              </div>
              
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
