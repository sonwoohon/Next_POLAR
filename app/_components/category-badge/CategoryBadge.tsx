import React from 'react';
import styles from './CategoryBadge.module.css';

interface CategoryBadgeProps {
  category: number;
  className?: string;
}

const categoryMap: Record<number, string> = {
  0: '전체',
  6: '짐 나르기',
  7: '청소',
  8: '수확(농경 보조)',
  9: '재난/재해 봉사',
  10: '김장',
  11: '스마트폰 질문',
  12: '대리 상담',
  13: '재능기부',
  14: '가벼운 배달',
  15: '장보기(편의점 등)',
  16: '콘서트 예매',
  17: '가벼운 대화(교감)',
  18: '간단한 상담',
  19: '티켓팅 줄 서기',
};

const categoryClassMap: Record<number, string> = {
  0: 'all',
  6: 'heavy',
  7: 'clean',
  8: 'harvest',
  9: 'disaster',
  10: 'kimchi',
  11: 'smartphone',
  12: 'consultation',
  13: 'talent',
  14: 'delivery',
  15: 'shopping',
  16: 'concert',
  17: 'conversation',
  18: 'counseling',
  19: 'ticketing',
};

const categoryEmojiMap: Record<number, string> = {
  0: '📋',
  6: '📦',
  7: '🧹',
  8: '🌾',
  9: '🚨',
  10: '🥬',
  11: '📱',
  12: '💼',
  13: '🎨',
  14: '📦',
  15: '🛒',
  16: '🎫',
  17: '💬',
  18: '💭',
  19: '🎫',
};

const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  className,
}) => {
  const badgeClass =
    styles.category +
    ' ' +
    styles[categoryClassMap[category] || 'etc'] +
    (className ? ' ' + className : '');
  return (
    <span className={badgeClass}>
      <span>{categoryEmojiMap[category] || '✨'}</span>
      {categoryMap[category] || '기타'}
    </span>
  );
};

export default CategoryBadge;
