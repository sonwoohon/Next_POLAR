'use client';
import { useState } from 'react';
import styles from './CategoryGrid.module.css';
import { getCategoryName, getCategoryEmoji } from '@/lib/utils/categoryUtils';

interface CategoryItem {
  id: number;
  text: string;
  emoji?: string;
  img?: string;
  isMore?: boolean;
}

interface CategoryGridProps {
  onCategoryClick?: (categoryId: number) => void;
  selectedCategoryId?: number | null;
}

export default function CategoryGrid({
  onCategoryClick,
  selectedCategoryId,
}: CategoryGridProps) {
  const [showMore, setShowMore] = useState(false);

  // 카테고리 데이터 생성 (전체 + 실제 sub_category_id: 6-19번)
  const categoryData: CategoryItem[] = [
    // 전체 카테고리 추가
    {
      id: 0, // 0은 전체를 의미
      text: '전체',
      emoji: '📋',
    },
    // 기존 카테고리들 (6-19번)
    ...Array.from({ length: 14 }, (_, i) => ({
      id: i + 6, // 6번부터 19번까지
      text: getCategoryName(i + 6),
      emoji: getCategoryEmoji(i + 6),
    })),
  ];

  const shownCategories = showMore
    ? categoryData
    : [
        // 전체 카테고리는 항상 첫 번째에 표시
        categoryData[0],
        // 나머지 카테고리 3개만 표시
        ...categoryData.slice(1, 4),
        // 더보기 버튼
        { id: 0, img: '', text: '더보기', isMore: true },
      ];

  return (
    <div className={styles.categoryRow}>
      {shownCategories.map((cat: CategoryItem, i: number) =>
        cat.isMore ? (
          <div
            className={styles.category}
            key={i}
            onClick={() => setShowMore(!showMore)}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.arrowOnly}>
              <svg
                width='40'
                height='40'
                viewBox='0 0 40 40'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <circle
                  cx='20'
                  cy='20'
                  r='19'
                  stroke='#E5E5E5'
                  strokeWidth='2'
                  fill='#fff'
                />
                <path
                  d={showMore ? 'M12 22l8-8 8 8' : 'M12 18l8 8 8-8'}
                  stroke='#888'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
            <div className={styles.categoryText}>
              {showMore ? '접기' : '더보기'}
            </div>
          </div>
        ) : (
          <div
            className={`${styles.category} ${
              selectedCategoryId === cat.id ||
              (cat.id === 0 && selectedCategoryId === null)
                ? styles.selected
                : ''
            }`}
            key={i}
            onClick={() => onCategoryClick?.(cat.id)}
            style={{ cursor: onCategoryClick ? 'pointer' : 'default' }}
          >
            <div className={styles.categoryIcon}>
              {/* <img
                src={cat.img}
                alt={cat.text}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              /> */}
              <div className={styles.iconPlaceholder}>{cat.emoji}</div>
            </div>
            <div className={styles.categoryText}>{cat.text}</div>
          </div>
        )
      )}
    </div>
  );
}
