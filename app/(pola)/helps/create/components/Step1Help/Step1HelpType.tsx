'use client';

import React from 'react';
import styles from './Step1HelpType.module.css';
import { getCategoryName, getCategoryEmoji } from '@/lib/utils/categoryUtils';
import { helpTypes } from '@/lib/constants/helpCreateStepConstants';
interface Step1HelpTypeProps {
  selectedTypes: string[];
  onTypeSelect: (type: string) => void;
}

const Step1HelpType: React.FC<Step1HelpTypeProps> = ({
  selectedTypes,
  onTypeSelect,
}) => {
  return (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>1단계 어떤 도움이 필요하세요?</h2>
      <p className={styles.stepSubtitle}>여러 개를 선택할 수 있어요!</p>

      <div className={styles.optionGrid}>
        {helpTypes.map((type) => (
          <div
            key={type.subCategoryId}
            className={`${styles.optionCard} ${
              selectedTypes.includes(type.subCategoryId.toString())
                ? styles.optionCardSelected
                : ''
            }`}
            onClick={() => onTypeSelect(type.subCategoryId.toString())}
          >
            <div className={styles.optionHeader}>
              <div className={`${styles.optionIcon} ${type.iconClass}`}>
                {getCategoryEmoji(type.subCategoryId)}
              </div>
              <span className={styles.optionLabel}>
                {getCategoryName(type.subCategoryId)}
              </span>
              {selectedTypes.includes(type.subCategoryId.toString()) && (
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
