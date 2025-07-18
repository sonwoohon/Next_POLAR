'use client';

import React from 'react';
import styles from './Step1HelpType.module.css';

interface Step1HelpTypeProps {
  selectedTypes: string[];
  onTypeSelect: (type: string) => void;
}

const Step1HelpType: React.FC<Step1HelpTypeProps> = ({
  selectedTypes,
  onTypeSelect,
}) => {
  const helpTypes = [
    {
      id: 'heavy',
      label: '무거워요',
      description: '무거운 짐을 들거나, 젊은 친구가 힘을 써야 해요!',
      icon: '💪',
      iconClass: styles.optionIconHeavy,
      subCategoryId: 1,
    },
    {
      id: 'difficult',
      label: '어려워요',
      description: '나한텐 너무 어려워요. 누가 설명해주세요!',
      icon: '🤔',
      iconClass: styles.optionIconDifficult,
      subCategoryId: 2,
    },
    {
      id: 'clean',
      label: '정리해요',
      description: '청소나 정리가 필요해요!',
      icon: '🧹',
      iconClass: styles.optionIconClean,
      subCategoryId: 3,
    },
    {
      id: 'learn',
      label: '배워요',
      description: '새로운 것을 배우고 싶어요!',
      icon: '📚',
      iconClass: styles.optionIconLearn,
      subCategoryId: 4,
    },
    {
      id: 'complex',
      label: '복잡해요',
      description: '복잡한 일을 도와주세요!',
      icon: '🔧',
      iconClass: styles.optionIconComplex,
      subCategoryId: 5,
    },
    {
      id: 'broken',
      label: '고장나요',
      description: '무언가가 고장났어요!',
      icon: '🔨',
      iconClass: styles.optionIconBroken,
      subCategoryId: 6,
    },
    {
      id: 'errand',
      label: '심부름',
      description: '심부름을 도와주세요!',
      icon: '🛒',
      iconClass: styles.optionIconErrand,
      subCategoryId: 7,
    },
  ];

  return (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>1단계 어떤 도움이 필요하세요?</h2>
      <p className={styles.stepSubtitle}>여러 개를 선택할 수 있어요!</p>

      <div className={styles.optionGrid}>
        {helpTypes.map((type) => (
          <div
            key={type.id}
            className={`${styles.optionCard} ${
              selectedTypes.includes(type.id) ? styles.optionCardSelected : ''
            }`}
            onClick={() => onTypeSelect(type.id)}
          >
            <div className={styles.optionHeader}>
              <div className={`${styles.optionIcon} ${type.iconClass}`}>
                {type.icon}
              </div>
              <span className={styles.optionLabel}>{type.label}</span>
              {selectedTypes.includes(type.id) && (
                <div className={styles.checkmark}>✓</div>
              )}
            </div>
            <p className={styles.optionDescription}>{type.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step1HelpType;
