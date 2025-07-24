'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/auth/useAuth';
import { useOnboardingAuth } from '@/lib/hooks/onboarding';
import styles from './Onboarding.module.css';

export default function OnboardingPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { shouldRender } = useOnboardingAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [skipAnimation, setSkipAnimation] = useState(false);

  const onboardingSteps = [
    {
      title: 'POLAR에 오신 것을 환영합니다!',
      description: '시니어와 주니어가 함께하는 봉사 플랫폼',
      image: '/images/onboarding/onboarding1.png',
    },
    {
      title: '간편한 도움 요청',
      description: '필요한 도움을 쉽게 요청하고 받아보세요',
      image: '/images/onboarding/onboarding2.png',
    },
    {
      title: '실시간 채팅',
      description: '도움을 주고받는 사람과 실시간으로 소통하세요',
      image: '/images/onboarding/onboarding3.png',
    },
    {
      title: '안전한 인증 시스템',
      description: '도움 완료를 안전하게 인증하고 관리하세요',
      image: '/images/onboarding/onboarding4.png',
    },
  ];

  useEffect(() => {
    if (currentUser) {
      router.push('/main');
    }
  }, [currentUser, router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < onboardingSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [onboardingSteps.length]);

  const handleSkip = () => {
    setSkipAnimation(true);
    setTimeout(() => {
      router.push('/main');
    }, 500);
  };

  const handleGetStarted = () => {
    setSkipAnimation(true);
    setTimeout(() => {
      router.push('/main');
    }, 500);
  };

  if (!shouldRender) {
    return null;
  }

  if (skipAnimation) {
    return (
      <div className={styles.container}>
        <div className={styles.fadeOut}>
          <h1>POLAR로 이동 중...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.onboardingContent}>
        <div className={styles.imageContainer}>
          <img
            src={onboardingSteps[currentStep].image}
            alt={onboardingSteps[currentStep].title}
            className={styles.onboardingImage}
          />
        </div>

        <div className={styles.textContainer}>
          <h1 className={styles.title}>{onboardingSteps[currentStep].title}</h1>
          <p className={styles.description}>
            {onboardingSteps[currentStep].description}
          </p>
        </div>

        <div className={styles.progressContainer}>
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`${styles.progressDot} ${
                index === currentStep ? styles.active : ''
              }`}
            />
          ))}
        </div>

        <div className={styles.buttonContainer}>
          <button className={styles.skipButton} onClick={handleSkip}>
            건너뛰기
          </button>
          <button
            className={styles.getStartedButton}
            onClick={handleGetStarted}
          >
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
