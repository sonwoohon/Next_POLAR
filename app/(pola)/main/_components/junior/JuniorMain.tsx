"use client";
import { useState } from "react";
import styles from "./JuniorMain.module.css";
// import HeaderSection from './sections/header/HeaderSection';
import ProfileSection from "./sections/profile/ProfileSection";
import StatsSection from "./sections/profile/StatsSection";
import TabSection from "./sections/navigation/TabSection";
import SwiperSection from "./sections/content/SwiperSection";
import HelpListSection from "./sections/list/HelpListSection";

import type { Swiper as SwiperType } from "swiper";
import {
  useHelpList,
  useHelpListByCategory,
  useHelpListByDate,
} from "@/lib/hooks/help/useHelpList";

export default function JuniorMainPage() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // getMonth()는 0부터 시작하므로 +1
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null // "전체" 카테고리가 기본값 (null = 전체)
  );
  const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null);

  // API로 help 리스트 조회 - 전체 리스트는 항상 조회
  const { data: allHelps = [], isLoading: isLoadingAllHelps } = useHelpList();

  // 날짜 필터링된 리스트 조회
  const { data: dateFilteredHelps = [], isLoading: isLoadingDateHelps } =
    useHelpListByDate(selectedDate);

  // 카테고리 필터링된 리스트 조회 (전체가 아닌 경우만)
  const {
    data: categoryFilteredHelps = [],
    isLoading: isLoadingCategoryHelps,
    isFetching: isFetchingCategory,
    error: categoryError,
  } = useHelpListByCategory(
    undefined,
    selectedCategoryId ? [selectedCategoryId] : undefined
  );

  console.log("[Component] React Query 상태:", {
    selectedCategoryId,
    categoryFilteredHelps: categoryFilteredHelps.length,
    isLoadingCategoryHelps,
    isFetchingCategory,
    categoryError,
  });

  // 필터링 로직: 날짜 > 카테고리 > 전체 순서로 우선순위 적용
  let filteredHelps = allHelps;
  let isLoadingFiltered = isLoadingAllHelps;
  let errorFiltered = null;

  console.log("[Component] 필터링 상태:", {
    selectedDate,
    selectedCategoryId,
    allHelpsCount: allHelps.length,
    dateFilteredCount: dateFilteredHelps.length,
    categoryFilteredCount: categoryFilteredHelps.length,
  });

  if (selectedDate) {
    // 날짜 필터링이 우선
    filteredHelps = dateFilteredHelps;
    isLoadingFiltered = isLoadingDateHelps;
    console.log("[Component] 날짜 필터링 적용:", filteredHelps.length);
  } else if (selectedCategoryId) {
    // 카테고리 필터링 (전체가 아닌 경우)
    filteredHelps = categoryFilteredHelps;
    isLoadingFiltered = isLoadingCategoryHelps;
    errorFiltered = categoryError;
    console.log("[Component] 카테고리 필터링 적용:", filteredHelps.length);
  } else {
    // 전체 리스트 (기본값)
    filteredHelps = allHelps;
    isLoadingFiltered = isLoadingAllHelps;
    console.log("[Component] 전체 리스트 적용:", filteredHelps.length);
  }

  // 통계 계산
  const totalHelps = allHelps.length;
  const openHelps = allHelps.filter((help) => help.status === "open").length;
  const connectingHelps = allHelps.filter(
    (help) => help.status === "connecting"
  ).length;

  const handleDateClick = (date: Date) => {
    console.log("[Component] 날짜 클릭:", date);

    // 같은 날짜를 다시 클릭하면 선택 해제 (토글)
    if (
      selectedDate &&
      selectedDate.getFullYear() === date.getFullYear() &&
      selectedDate.getMonth() === date.getMonth() &&
      selectedDate.getDate() === date.getDate()
    ) {
      console.log("[Component] 날짜 선택 해제");
      setSelectedDate(null);
    } else {
      console.log("[Component] 날짜 선택:", date);
      setSelectedDate(date);
    }
    // 날짜 선택 시 카테고리 선택 해제
    setSelectedCategoryId(null);
  };

  const handleCategoryClick = (categoryId: number) => {
    console.log("[Component] 카테고리 클릭:", categoryId);

    // "전체" 카테고리(id: 0) 클릭 시 전체 리스트로 설정
    if (categoryId === 0) {
      console.log("[Component] 전체 카테고리 클릭 - 전체 리스트로 설정");
      setSelectedCategoryId(null);
      setSelectedDate(null);
      return;
    }

    // 같은 카테고리를 다시 클릭하면 선택 해제 (토글)
    if (selectedCategoryId === categoryId) {
      console.log("[Component] 카테고리 선택 해제 - 전체로 돌아감");
      setSelectedCategoryId(null);
    } else {
      console.log("[Component] 카테고리 선택:", categoryId);
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
      <ProfileSection />
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
