'use client';
import { useState } from 'react';
import styles from './CategoryGrid.module.css';

const categoryData = [
  { img: '/cat-korean.png', text: '무거워요' },
  { img: '/cat-burger.png', text: '어려워요' },
  { img: '/cat-pizza.png', text: '정리해요' },
  { img: '/cat-cutlet.png', text: '배워요' },
  { img: '/cat-jokbal.png', text: '복잡해요' },
  { img: '/cat-chicken.png', text: '고장나요' },
  { img: '/cat-snack.png', text: '심부름' },
  { img: '/cat-fold.png', text: '접기', isMore: true },
];

export default function CategoryGrid() {
  const [showMore, setShowMore] = useState(false);

  const shownCategories = showMore
    ? categoryData
    : categoryData
        .slice(0, 3)
        .concat([{ img: '', text: '더보기', isMore: true }]);

  return (
    <div className={styles.categoryRow}>
      {shownCategories.map((cat, i) =>
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
          <div className={styles.category} key={i}>
            <div className={styles.categoryIcon}>
              <img
                src={cat.img}
                alt={cat.text}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div className={styles.categoryText}>{cat.text}</div>
          </div>
        )
      )}
    </div>
  );
}
