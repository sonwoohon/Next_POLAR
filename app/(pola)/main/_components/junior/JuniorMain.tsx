'use client';
import { useState } from 'react';
import styles from './JuniorMain.module.css';
import { mockHelps } from './data/mockHelps';
/* import HeaderSection from './sections/header/HeaderSection'; 임시헤더 주석*/
import ProfileSection from './sections/profile/ProfileSection';
import StatsSection from './sections/profile/StatsSection';
import TabSection from './sections/navigation/TabSection';
import SwiperSection from './sections/content/SwiperSection';
import HelpListSection from './sections/list/HelpListSection';

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
      {/* <HeaderSection /> */}
      <ProfileSection />
      <StatsSection 
        totalHelps={totalHelps}
        openHelps={openHelps}
        connectingHelps={connectingHelps}
      />
      <TabSection 
        onCategoryClick={handleCategoryClick}
        onCalendarClick={handleCalendarClick}
      />
      <SwiperSection 
        currentYear={currentYear}
        currentMonth={currentMonth}
        mockHelps={mockHelps}
        selectedDate={selectedDate}
        onDateClick={handleDateClick}
        onSwiperRef={setSwiperRef}
      />
      <HelpListSection filteredHelps={filteredHelps} />
    </div>
  );
}
