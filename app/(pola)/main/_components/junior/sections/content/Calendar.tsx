'use client';

import { useState, useEffect } from 'react';
import 'react-calendar/dist/Calendar.css';
import styles from './Calendar.module.css';
import Calendar from 'react-calendar';
import { HelpResponseDto } from '@/backend/helps/applications/dtos/HelpDTO';

interface CalendarProps {
  year: number;
  month: number;
  helps?: HelpResponseDto[];
  onDateClick?: (date: Date) => void;
  selectedDate?: Date;
}

import { getBigCategory } from '@/lib/utils/categoryUtils';

// Big Category 색상 매핑
const getBigCategoryColor = (bigCategory: string): string => {
  switch (bigCategory) {
    case '힘':
      return '#ff6b6b'; // 빨강
    case '지능':
      return '#4ecdc4'; // 청록색
    case '매력':
      return '#45b7d1'; // 파란색
    case '인내':
      return '#96ceb4'; // 초록색
    case '신속':
      return '#feca57'; // 노란색
    default:
      return '#a18cd1'; // 보라색
  }
};

export default function CustomCalendar({
  helps = [], // 기본값으로 빈 배열 사용
  onDateClick,
  selectedDate,
}: CalendarProps) {
  const [value, setValue] = useState<Date>(selectedDate || new Date());
  const [allHelps, setAllHelps] = useState<HelpResponseDto[]>(helps);

  // 컴포넌트 마운트 시 helps 데이터 설정
  useEffect(() => {
    setAllHelps(helps);
  }, [helps]);

  // 특정 날짜의 help 목록 가져오기 (start_date인 help만)
  const getHelpsForDate = (date: Date): HelpResponseDto[] => {
    return allHelps.filter((help) => {
      // startDate는 이미 YYYY-MM-DD 형식의 문자열
      const helpStartDate = help.startDate;
      const targetDateStr = date.toISOString().split('T')[0];

      return helpStartDate === targetDateStr;
    });
  };

  // react-calendar의 tileContent prop을 위한 함수
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dayHelps = getHelpsForDate(date);

      if (dayHelps.length > 0) {
        return (
          <div className={styles.tileContent}>
            {dayHelps.slice(0, 5).map((help) => {
              const categoryId = help.category[0]?.id || 0;
              const bigCategory = getBigCategory(categoryId);
              const color = getBigCategoryColor(bigCategory);

              return (
                <div
                  key={help.id}
                  className={styles.categoryDot}
                  style={{ backgroundColor: color }}
                  title={`${help.title} (${bigCategory})`}
                />
              );
            })}
            {dayHelps.length > 5 && (
              <div className={styles.moreDots}>+{dayHelps.length - 5}</div>
            )}
          </div>
        );
      }
    }
    return null;
  };

  // react-calendar의 tileClassName prop을 위한 함수
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dayHelps = getHelpsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected =
        selectedDate && date.toDateString() === selectedDate.toDateString();

      let className = styles.calendarTile;

      if (isToday) className += ` ${styles.today}`;
      if (isSelected) className += ` ${styles.selected}`;
      if (dayHelps.length > 0) className += ` ${styles.hasHelps}`;

      return className;
    }
    return '';
  };

  const handleDateChange = (value: unknown) => {
    // 타입 안전성을 위한 런타임 체크
    if (value instanceof Date) {
      setValue(value);
      if (onDateClick) {
        onDateClick(value);
      }
    }
  };

  return (
    <div className={styles.calendarContainer}>
      <Calendar
        onChange={handleDateChange}
        value={value}
        tileContent={tileContent}
        tileClassName={tileClassName}
        locale='ko-KR'
        formatDay={(locale, date) => date.getDate().toString()}
        className={styles.reactCalendar}
      />
    </div>
  );
}
