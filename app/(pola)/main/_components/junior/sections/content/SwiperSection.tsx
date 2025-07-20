import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import styles from './SwiperSection.module.css';
import CategoryGrid from '@/app/_components/CategoryGrid';
import Calendar from './Calendar';

import { HelpResponseDto } from '@/backend/helps/applications/dtos/HelpDTO';

interface SwiperSectionProps {
  currentYear: number;
  currentMonth: number;
  allHelps: HelpResponseDto[]; // 캘린더용 전체 리스트
  selectedDate: Date | null;
  selectedCategoryId: number | null;
  onDateClick: (date: Date) => void;
  onCategoryClick: (categoryId: number) => void;
  onSwiperRef: (swiper: SwiperType) => void;
  isLoading?: boolean;
}

export default function SwiperSection({
  currentYear,
  currentMonth,
  allHelps,
  selectedDate,
  selectedCategoryId,
  onDateClick,
  onCategoryClick,
  onSwiperRef,
}: SwiperSectionProps) {
  return (
    <div className={styles.swiperWrapper}>
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        className={styles.swiperContainer}
        spaceBetween={0}
        slidesPerView={1}
        loop={false}
        onSwiper={onSwiperRef}
      >
        <SwiperSlide className={styles.swiperSlide}>
          <CategoryGrid
            onCategoryClick={onCategoryClick}
            selectedCategoryId={selectedCategoryId}
          />
        </SwiperSlide>
        <SwiperSlide className={styles.swiperSlide}>
          <Calendar
            year={currentYear}
            month={currentMonth}
            helps={allHelps}
            onDateClick={onDateClick}
            selectedDate={selectedDate || undefined}
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
