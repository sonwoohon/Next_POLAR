'use client';

import React from 'react';
import styles from './Step1HelpType.module.css';
import { getCategoryName, getCategoryEmoji } from '@/lib/utils/categoryUtils';

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
      description: '무거운 짐을 들거나, 젊은 친구가 힘을 써야 해요!',
      iconClass: styles.optionIconHeavy,
      subCategoryId: 6, // 짐 나르기
    },
    {
      description: '청소나 정리가 필요해요!',
      iconClass: styles.optionIconClean,
      subCategoryId: 7, // 청소
    },
    {
      description: '농경 보조 작업을 도와주세요!',
      iconClass: styles.optionIconHeavy,
      subCategoryId: 8, // 수확(농경 보조)
    },
    {
      description: '재난/재해 봉사 활동을 도와주세요!',
      iconClass: styles.optionIconHeavy,
      subCategoryId: 9, // 재난/재해 봉사
    },
    {
      description: '김장 작업을 도와주세요!',
      iconClass: styles.optionIconHeavy,
      subCategoryId: 10, // 김장
    },
    {
      description: '스마트폰 사용에 대해 질문이 있어요!',
      iconClass: styles.optionIconDifficult,
      subCategoryId: 11, // 스마트폰 질문
    },
    {
      description: '대리 상담을 도와주세요!',
      iconClass: styles.optionIconComplex,
      subCategoryId: 12, // 대리 상담
    },
    {
      description: '재능 기부를 도와주세요!',
      iconClass: styles.optionIconLearn,
      subCategoryId: 13, // 재능기부
    },
    {
      description: '가벼운 배달을 도와주세요!',
      iconClass: styles.optionIconErrand,
      subCategoryId: 14, // 가벼운 배달
    },
    {
      description: '장보기를 도와주세요!',
      iconClass: styles.optionIconErrand,
      subCategoryId: 15, // 장보기(편의점 등)
    },
    {
      description: '콘서트 예매를 도와주세요!',
      iconClass: styles.optionIconErrand,
      subCategoryId: 16, // 콘서트 예매
    },
    {
      description: '가벼운 대화와 교감을 나누고 싶어요!',
      iconClass: styles.optionIconLearn,
      subCategoryId: 17, // 가벼운 대화(교감)
    },
    {
      description: '간단한 상담을 받고 싶어요!',
      iconClass: styles.optionIconComplex,
      subCategoryId: 18, // 간단한 상담
    },
    {
      description: '티켓팅 줄 서기를 도와주세요!',
      iconClass: styles.optionIconErrand,
      subCategoryId: 19, // 티켓팅 줄 서기
    },
  ];

  return (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>1단계 어떤 도움이 필요하세요?</h2>
      <p className={styles.stepSubtitle}>여러 개를 선택할 수 있어요!</p>

      <div className={styles.optionGrid}>
        {helpTypes.map((type) => (
          <div
            key={type.subCategoryId}
            className={`${styles.optionCard} ${
              selectedTypes.includes(type.subCategoryId.toString()) ? styles.optionCardSelected : ''
            }`}
            onClick={() => onTypeSelect(type.subCategoryId.toString())}
          >
            <div className={styles.optionHeader}>
              <div className={`${styles.optionIcon} ${type.iconClass}`}>
                {getCategoryEmoji(type.subCategoryId)}
              </div>
              <span className={styles.optionLabel}>{getCategoryName(type.subCategoryId)}</span>
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
