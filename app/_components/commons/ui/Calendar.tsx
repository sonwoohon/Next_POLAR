'use client';

import { useState, useEffect } from 'react';
import styles from './Calendar.module.css';
interface Help {
  id: number;
  title: string;
  content: string;
  startDate: string;
  endDate: string;
  status: string;
  seniorNickname: string;
}

interface CalendarProps {
  year: number;
  month: number;
  helps?: Help[];
  onDateClick?: (date: Date) => void;
  selectedDate?: Date;
}

export default function Calendar({ 
  year, 
  month, 
  helps = [], 
  onDateClick,
  selectedDate 
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date(year, month - 1));
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);

  // 달력 데이터 생성
  useEffect(() => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: Date[] = [];
    const current = new Date(startDate);

    // 6주치 날짜 생성 (42)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    setCalendarDays(days);
  }, [year, month]);

  // 특정 날짜의 help 목록 가져오기
  const getHelpsForDate = (date: Date): Help[] => {
    const dateStr = date.toISOString().split('T')[0];
    return helps.filter(help => {
      const helpStart = new Date(help.startDate);
      const helpEnd = new Date(help.endDate);
      const targetDate = new Date(date);
      
      return targetDate >= helpStart && targetDate <= helpEnd;
    });
  };

  // 날짜가 현재 월에 속하는지 확인
  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === month -1 && date.getFullYear() === year;
  };

  // 날짜가 오늘인지 확인
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // 날짜가 선택된 날짜인지 확인
  const isSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const handleDateClick = (date: Date) => {
    if (onDateClick) {
      onDateClick(date);
    }
  };

  const weekdays = ['일', '월', '화', '수', '목', '토'];

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {year}년 {month}월
        </h2>
      </div>
      
      <div className={styles.weekdays}>
        {weekdays.map((day, index) => (
          <div 
            key={day} 
            className={`${styles.weekday} ${index ===0 ? styles.sunday : ''}`}
          >
            {day}
          </div>
        ))}
      </div>
      
      <div className={styles.days}>
        {calendarDays.map((date, index) => {
          const dayHelps = getHelpsForDate(date);
          const isCurrentMonthDay = isCurrentMonth(date);
          const isTodayDate = isToday(date);
          const isSelectedDate = isSelected(date);
          
          return (
            <div
              key={index}
              className={`
                ${styles.day}
                ${!isCurrentMonthDay ? styles.otherMonth : ''}                ${isTodayDate ? styles.today : ''}                ${isSelectedDate ? styles.selected : ''}                ${dayHelps.length > 0 ? styles.hasHelps : ''}
              `}
              onClick={() => handleDateClick(date)}
            >
              <div className={styles.dateNumber}>
                {date.getDate()}
              </div>
              
              {dayHelps.length > 0 && (
                <div className={styles.helpList}>
                  {dayHelps.slice(0, 2).map((help) => (
                    <div key={help.id} className={styles.helpItem}>
                      <div className={styles.helpTitle}>
                        {help.title.length > 8 
                          ? `${help.title.substring(0, 8)}...` 
                          : help.title
                        }
                      </div>
                      <div className={styles.helpSenior}>
                        {help.seniorNickname}
                      </div>
                    </div>
                  ))}
                  {dayHelps.length > 2 && (
                    <div className={styles.moreHelps}>
                      +{dayHelps.length - 2}개 더
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 