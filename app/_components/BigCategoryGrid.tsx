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

interface BigCategoryGridProps {
  onCategoryClick?: (categoryId: number) => void;
  selectedCategoryId?: number | null;
}

interface BigCategoryGroup {
  id: number;
  name: string;
  categories: CategoryItem[];
}

export default function BigCategoryGrid({
  onCategoryClick,
  selectedCategoryId,
}: BigCategoryGridProps) {
  const [showMore, setShowMore] = useState(false);

  // 대분류별 카테고리 그룹 생성
  const bigCategoryGroups: BigCategoryGroup[] = [
    {
      id: 1,
      name: '힘',
      categories: [6, 7, 8, 9, 10].map((id) => ({
        id,
        text: getCategoryName(id),
        emoji: getCategoryEmoji(id),
      })),
    },
    {
      id: 2,
      name: '지능',
      categories: [11, 12, 13].map((id) => ({
        id,
        text: getCategoryName(id),
        emoji: getCategoryEmoji(id),
      })),
    },
    {
      id: 3,
      name: '매력',
      categories: [14, 15, 16].map((id) => ({
        id,
        text: getCategoryName(id),
        emoji: getCategoryEmoji(id),
      })),
    },
    {
      id: 4,
      name: '인내',
      categories: [17, 18].map((id) => ({
        id,
        text: getCategoryName(id),
        emoji: getCategoryEmoji(id),
      })),
    },
    {
      id: 5,
      name: '신속',
      categories: [19].map((id) => ({
        id,
        text: getCategoryName(id),
        emoji: getCategoryEmoji(id),
      })),
    },
  ];

  const shownGroups = showMore
    ? bigCategoryGroups
    : bigCategoryGroups.slice(0, 3);

  return (
    <div className={styles.container}>
      {shownGroups.map((group) => (
        <div key={group.id} className={styles.bigCategoryGroup}>
          <h3 className={styles.bigCategoryTitle}>{group.name}</h3>
          <div className={styles.categoryRow}>
            {group.categories.map((cat: CategoryItem, i: number) => (
              <div
                className={`${styles.category} ${
                  selectedCategoryId === cat.id ? styles.selected : ''
                }`}
                key={i}
                onClick={() => onCategoryClick?.(cat.id)}
                style={{ cursor: onCategoryClick ? 'pointer' : 'default' }}
              >
                <div className={styles.categoryIcon}>
                  <div className={styles.iconPlaceholder}>{cat.emoji}</div>
                </div>
                <div className={styles.categoryText}>{cat.text}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {bigCategoryGroups.length > 3 && (
        <div className={styles.moreButtonContainer}>
          <button
            className={styles.moreButton}
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? '접기' : '더보기'}
          </button>
        </div>
      )}
    </div>
  );
}
