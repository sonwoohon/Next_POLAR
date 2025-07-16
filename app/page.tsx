"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import styles from './Onboarding.module.css';

// 온보딩 슬라이드에 표시할 컨텐츠 목록
const slides = [
  {
    title: '함께하는 마음, 두 세대의 연결',
    img: 'https://source.unsplash.com/featured/?laptop,work',
    desc: '도움이 필요한 실버와\n따뜻한 손길을 내미는 주니어가\n서로를 만나는 공간입니다.'
  },
  {
    title: '요청과 도움, 모두의 성장',
    img: 'https://source.unsplash.com/featured/?handshake,people',
    desc: '실버의 작은 요청이\n주니어의 소중한 경험이 됩니다.\n서로의 일상에 힘이 되어주세요.'
  },
  {
    title: '정성스러운 봉사, 소중한 보상',
    img: 'https://source.unsplash.com/featured/?security,shield',
    desc: '주니어의 진심 어린 도움에는\n폴라 스코어로 감사의 마음을 전합니다.'
  },
  {
    title: '안전하고 따뜻한 소통',
    img: 'https://source.unsplash.com/featured/?signup,join',
    desc: '믿을 수 있는 채팅과\n투명한 시스템으로\n모두가 안심할 수 있습니다.'
  }
];

export default function Home() {
  const router = useRouter();

  // 1. react-query로 로그인/회원정보(쿠키 기반) 조회
  //    - 성공 시 user 객체 반환 (role: 'junior' | 'senior' 등)
  //    - 실패(비회원/쿠키없음) 시 undefined
  const { data: user } = useQuery({
    queryKey: ['userInfo'],
    queryFn: async () => {
      const res = await axios.get('/api/users', { withCredentials: true });
      return res.data;
    },
    retry: false, // 실패 시 재시도 안함
  });

  // 2. 회원타입에 따라 자동 리다이렉트
  //    - 주니어면 /junior, 시니어면 /senior, 비회원이면 잔류
  useEffect(() => {
    if (user?.role === 'junior') router.replace('/junior');
    else if (user?.role === 'senior') router.replace('/senior');
    // else: 잔류
  }, [user, router]);

  // 3. 로그인/회원가입 버튼 클릭 시 각 페이지로 이동
  const handleLogin = () => {
    router.push('/login');
  };
  const handleSignup = () => {
    router.push('/sign-up');
  };

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
        spaceBetween={30}
        slidesPerView={1}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        className={styles.swiper}
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className={styles.slideContent}>
              <h2 className={styles.slideTitle}>{slide.title}</h2>
              <img className={styles.slideImg} src={slide.img} alt={slide.title} />
              <p className={styles.slideDesc}>{slide.desc}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className={styles.buttonWrap}>
        <button className={styles.loginBtn} onClick={handleLogin}>로그인</button>
        <button className={styles.signupBtn} onClick={handleSignup}>회원가입</button>
      </div>
    </div>
  );
}
