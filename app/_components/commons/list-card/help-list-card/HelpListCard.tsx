'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './HelpListCard.module.css';
import CategoryBadge from '@/app/_components/category-badge/CategoryBadge';
import type { HelpListResponseDto } from '@/backend/helps/applications/dtos/HelpDTO';

interface HelpListCardProps {
  help: HelpListResponseDto;
}

const getRewardByCategory = (category: { id: number; point: number }[]) => {
  // 카테고리별로 고정된 seed로 임의의 점수 생성 (10,000~100,000, 10,000 단위)
  const base = ((category[0]?.id ?? 1) * 23457) % 10;
  return (base + 1) * 10000;
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'open':
      return '모집중';
    case 'connecting':
      return '연결중';
    case 'completed':
      return '완료';
    case 'close':
      return '취소됨';
    default:
      return status;
  }
};

const HelpListCard: React.FC<HelpListCardProps> = ({ help }) => {
  const { seniorInfo, title, startDate, endDate, category, status } = help;

  // 날짜 포맷
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return `${d.getFullYear()}.${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}.${d.getDate().toString().padStart(2, '0')}`;
  };

  return (
    <Link href={`/helps/${help.id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.thumbnail}>
          <Image
            src={seniorInfo.profileImgUrl || '/images/dummies/dummy_user.png'}
            alt='썸네일'
            width={100}
            height={100}
            className={styles.thumbnailImg}
            style={{ objectFit: 'cover', borderRadius: '0.8rem' }}
            priority={true}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/dummies/dummy_user.png';
            }}
          />
        </div>
        <div className={styles.info}>
          <div className={styles.topRow}>
            <CategoryBadge category={category[0]?.id} />
            <span className={`${styles.status} ${styles[status] || ''}`}>
              {getStatusText(status)}
            </span>
          </div>
          <div className={styles.title}>{title}</div>
          <div className={styles.subInfo}>
            <span className={styles.nickname}>
              {seniorInfo.name || seniorInfo.nickname}
            </span>
            <span className={styles.date}>
              {formatDate(startDate)} ~ {formatDate(endDate)}
            </span>
            <span className={styles.reward}>
              {getRewardByCategory(category).toLocaleString()}점
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HelpListCard;
