'use client';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import styles from './JuniorMain.module.css';
import ProfileBanner from '@/app/_components/ProfileBanner';
import CategoryGrid from '@/app/_components/CategoryGrid';
import Calendar from '@/app/(pola)/main/_components/junior/calendar/Calendar';
import HelpStats from '@/app/(pola)/main/_components/junior/calendar/HelpStats';
import HelpListCard from '@/app/_components/commons/list-card/HelpListCard';
import Link from 'next/link';

// 임시 데이터
const mockHelps = [
  {
    id: 1,
    title: '장보기 도와주세요',
    content: '편의점에서 장보기 도움이 필요합니다.',
    startDate: '2025-07-15',
    endDate: '2025-07-15',
    status: 'open',
    seniorNickname: '김시니어',
    category: 8 // 지능 (장보기)
  },
  {
    id: 2,
    title: '청소 도와주세요',
    content: '집 청소를 도와주실 분을 찾습니다.',
    startDate: '2025-07-17',
    endDate: '2025-07-17',
    status: 'connecting',
    seniorNickname: '이시니어',
    category: 2 // 힘 (청소)
  },
  {
    id: 3,
    title: '스마트폰 사용법',
    content: '스마트폰 사용법을 가르쳐주세요.',
    startDate: '2025-07-20',
    endDate: '2025-07-20',
    status: 'open',
    seniorNickname: '박시니어',
    category: 6 // 지능 (스마트폰)
  },
  {
    id: 4,
    title: '짐 나르기',
    content: '무거운 짐을 옮기는 것을 도와주세요.',
    startDate: '2025-07-22',
    endDate: '2025-07-22',
    status: 'open',
    seniorNickname: '최시니어',
    category: 1 // 힘 (짐 나르기)
  },
  {
    id: 5,
    title: '가벼운 대화',
    content: '함께 이야기 나눌 분을 찾습니다.',
    startDate: '2025-07-25',
    endDate: '2025-07-25',
    status: 'open',
    seniorNickname: '정시니어',
    category: 14 // 매력 (가벼운 대화)
  },
  {
    id: 6,
    title: '콘서트 예매',
    content: '콘서트 티켓 예매를 도와주세요.',
    startDate: '2025-07-17',
    endDate: '2025-07-17',
    status: 'connecting',
    seniorNickname: '한시니어',
    category: 11 // 민첩 (콘서트 예매)
  },
  {
    id: 7,
    title: '간단한 상담',
    content: '생활에 관한 간단한 상담을 받고 싶습니다.',
    startDate: '2025-07-30',
    endDate: '2025-07-30',
    status: 'open',
    seniorNickname: '윤시니어',
    category: 15 // 매력 (간단한 상담)
  },
  {
    id: 8,
    title: '재능기부',
    content: '음악을 가르쳐주실 분을 찾습니다.',
    startDate: '2025-07-28',
    endDate: '2025-07-28',
    status: 'open',
    seniorNickname: '임시니어',
    category: 8 // 지능 (재능기부)
  },
  {
    id: 9,
    title: '가벼운 배달',
    content: '가벼운 물건 배달을 도와주세요.',
    startDate: '2025-07-18',
    endDate: '2025-07-18',
    status: 'open',
    seniorNickname: '강시니어',
    category: 9 // 민첩 (가벼운 배달)
  },
  {
    id: 10,
    title: '대리 상담',
    content: '전화 상담을 대신 해주세요.',
    startDate: '2025-07-23',
    endDate: '2025-07-23',
    status: 'open',
    seniorNickname: '조시니어',
    category: 7 // 지능 (대리 상담)
  },
  {
    id: 11,
    title: '티켓팅 줄 서기',
    content: '티켓팅을 위해 줄을 서주세요.',
    startDate: '2025-07-26',
    endDate: '2025-07-26',
    status: 'open',
    seniorNickname: '백시니어',
    category: 16 // 매력 (티켓팅 줄 서기)
  },
  {
    id: 12,
    title: '수확 도와주세요',
    content: '농작물 수확을 도와주세요.',
    startDate: '2025-07-19',
    endDate: '2025-07-19',
    status: 'connecting',
    seniorNickname: '남시니어',
    category: 3 // 힘 (수확)
  }
];

export default function JuniorMainPage() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // getMonth()는 0부터 시작하므로 +1
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [swiperRef, setSwiperRef] = useState<any>(null);

  // 선택된 날짜의 help만 필터링
  const filteredHelps = selectedDate 
    ? mockHelps.filter(help => {
        const helpStartDate = new Date(help.startDate);
        const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
        const helpStartDateOnly = new Date(helpStartDate.getFullYear(), helpStartDate.getMonth(), helpStartDate.getDate());
        return selectedDateOnly.getTime() === helpStartDateOnly.getTime();
      })
    : mockHelps;

  // 통계 계산
  const totalHelps = mockHelps.length;
  const openHelps = mockHelps.filter(help => help.status === 'open').length;
  const connectingHelps = mockHelps.filter(help => help.status === 'connecting').length;

  const handleDateClick = (date: Date) => {
    // 같은 날짜를 다시 클릭하면 선택 해제 (토글)
    if (selectedDate && 
        selectedDate.getFullYear() === date.getFullYear() &&
        selectedDate.getMonth() === date.getMonth() &&
        selectedDate.getDate() === date.getDate()) {
      setSelectedDate(null);
    } else {
      setSelectedDate(date);
    }
  };

  const handleCategoryClick = () => {
    if (swiperRef) {
      swiperRef.slideTo(0);
    }
  };

  const handleCalendarClick = () => {
    if (swiperRef) {
      swiperRef.slideTo(1);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.back}>{'<'} </span>
        <span className={styles.menu}>☰</span>
      </header>
            <div className={styles.profileBanner}>
        <ProfileBanner />
      </div>
      <HelpStats 
        totalHelps={totalHelps}
        openHelps={openHelps}
        connectingHelps={connectingHelps}
      />
      <div className={styles.buttonContainer}>
        <button className={styles.tabButton} onClick={handleCategoryClick}>카테고리</button>
        <button className={styles.tabButton} onClick={handleCalendarClick}>캘린더</button>
      </div>
      <div className={styles.swiperWrapper}>
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          className={styles.swiperContainer}
          spaceBetween={0}
          slidesPerView={1}
          loop={false}
          onSwiper={setSwiperRef}
        >
          <SwiperSlide className={styles.swiperSlide}>
            <CategoryGrid />
          </SwiperSlide>
          <SwiperSlide className={styles.swiperSlide}>
            <Calendar 
              year={currentYear} 
              month={currentMonth} 
              helps={mockHelps} 
              onDateClick={handleDateClick}
              selectedDate={selectedDate || undefined}
            />
          </SwiperSlide>
        </Swiper>
      </div>
      <div className={styles.helpList}>
        {filteredHelps.map((help) => (
          <Link key={help.id} href={`/helps/${help.id}`}>
            <HelpListCard 
              help={{
                id: help.id,
                title: help.title,
                content: help.content,
                startDate: new Date(help.startDate),
                endDate: new Date(help.endDate),
                status: help.status,
                category: help.category,
                seniorInfo: { nickname: help.seniorNickname },
                createdAt: new Date(help.startDate)
              }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
