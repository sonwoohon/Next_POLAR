'use client';
import { useState } from 'react';
import styles from './JuniorMain.module.css';
import UserTierSection from '@/app/_components/sections/user-tier/UserTierSection';
import StatsSection from './sections/profile/StatsSection';
import TabSection from './sections/navigation/TabSection';
import SwiperSection from './sections/content/SwiperSection';
import HelpListSection from './sections/list/HelpListSection';

import type { Swiper as SwiperType } from 'swiper';
import {
  useHelpList,
  useHelpListByCategory,
  useHelpListByDate,
} from '@/lib/hooks/help/useHelpList';

export default function JuniorMainPage() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // getMonth()는 0부터 시작하므로 +1
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null);

  const { data: allHelps = [], isLoading: isLoadingAllHelps } = useHelpList();

  const { data: dateFilteredHelps = [], isLoading: isLoadingDateHelps } =
    useHelpListByDate(selectedDate);

  const {
    data: categoryFilteredHelps = [],
    isLoading: isLoadingCategoryHelps,
    error: categoryError,
  } = useHelpListByCategory(
    undefined,
    selectedCategoryId ? [selectedCategoryId] : undefined
  );

  let filteredHelps = allHelps;
  let isLoadingFiltered = isLoadingAllHelps;
  let errorFiltered = null;

  if (selectedDate) {
    // 날짜 필터링이 우선
    filteredHelps = dateFilteredHelps;
    isLoadingFiltered = isLoadingDateHelps;
  } else if (selectedCategoryId) {
    // 카테고리 필터링 (전체가 아닌 경우)
    filteredHelps = categoryFilteredHelps;
    isLoadingFiltered = isLoadingCategoryHelps;
    errorFiltered = categoryError;
  } else {
    // 전체 리스트 (기본값)
    filteredHelps = allHelps;
    isLoadingFiltered = isLoadingAllHelps;
  }

  // 주니어는 open 상태의 헬프만 볼 수 있도록 필터링
  filteredHelps = filteredHelps.filter((help) => help.status === 'open');

  // 통계 계산
  const totalHelps = allHelps.length;
  const openHelps = allHelps.filter((help) => help.status === 'open').length;
  const connectingHelps = allHelps.filter(
    (help) => help.status === 'connecting'
  ).length;

  const handleDateClick = (date: Date) => {
    // 같은 날짜를 다시 클릭하면 선택 해제 (토글)
    if (
      selectedDate &&
      selectedDate.getFullYear() === date.getFullYear() &&
      selectedDate.getMonth() === date.getMonth() &&
      selectedDate.getDate() === date.getDate()
    ) {
      setSelectedDate(null);
    } else {
      setSelectedDate(date);
    }
    // 날짜 선택 시 카테고리 선택 해제
    setSelectedCategoryId(null);
  };

  const handleCategoryClick = (categoryId: number) => {
    // "전체" 카테고리(id: 0) 클릭 시 전체 리스트로 설정
    if (categoryId === 0) {
      setSelectedCategoryId(null);
      setSelectedDate(null);
      return;
    }

    // 같은 카테고리를 다시 클릭하면 선택 해제 (토글)
    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(null);
    } else {
      setSelectedCategoryId(categoryId);
    }
    // 카테고리 선택 시 날짜 선택 해제
    setSelectedDate(null);
  };

  const handleCategoryTabClick = () => {
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
      <UserTierSection seasonNumber={1} />
      <StatsSection
        totalHelps={totalHelps}
        openHelps={openHelps}
        connectingHelps={connectingHelps}
      />
      <TabSection
        onCategoryClick={handleCategoryTabClick}
        onCalendarClick={handleCalendarClick}
      />
      <SwiperSection
        currentYear={currentYear}
        currentMonth={currentMonth}
        allHelps={allHelps} // 캘린더에는 항상 전체 리스트 전달
        selectedDate={selectedDate}
        selectedCategoryId={selectedCategoryId}
        onDateClick={handleDateClick}
        onCategoryClick={handleCategoryClick}
        onSwiperRef={setSwiperRef}
      />
      <HelpListSection
        filteredHelps={filteredHelps}
        isLoading={isLoadingFiltered}
        error={errorFiltered}
      />
    </div>
  );
}
