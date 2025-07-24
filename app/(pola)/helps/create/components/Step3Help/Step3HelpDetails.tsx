'use client';
import React, { useState } from 'react';
import styles from './Step3HelpDetails.module.css';
import ImageUploader from '@/app/_components/commons/imageUploader/ImageUploader';
import SuggestionMode from './SuggestionMode';
import DirectInputMode from './DirectInputMode';

interface Step3HelpDetailsProps {
  title: string;
  content: string;
  selectedCategories: number[];
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
}

const Step3HelpDetails: React.FC<Step3HelpDetailsProps> = ({
  title,
  content,
  selectedCategories,
  onTitleChange,
  onContentChange,
}) => {
  const [isDirectInput, setIsDirectInput] = useState<boolean>(false);

  return (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>
        3단계 도움받고 싶은 내용을 입력해주세요
      </h2>

      {/* 토글 버튼 */}
      <div className={styles.toggleContainer}>
        <button
          className={`${styles.toggleButton} ${
            !isDirectInput ? styles.toggleButtonActive : ''
          }`}
          onClick={() => setIsDirectInput(false)}
        >
          💡 제안 선택
        </button>
        <button
          className={`${styles.toggleButton} ${
            isDirectInput ? styles.toggleButtonActive : ''
          }`}
          onClick={() => setIsDirectInput(true)}
        >
          ✏️ 직접 입력
        </button>
      </div>

      {!isDirectInput ? (
        <SuggestionMode
          title={title}
          content={content}
          selectedCategories={selectedCategories}
          onTitleChange={onTitleChange}
          onContentChange={onContentChange}
        />
      ) : (
        <DirectInputMode
          title={title}
          content={content}
          onTitleChange={onTitleChange}
          onContentChange={onContentChange}
        />
      )}

      {/* 이미지 업로드 (공통) */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>첨부할 이미지</label>
        <ImageUploader maxFiles={5} maxFileSize={5} />
      </div>
    </div>
  );
};

export default Step3HelpDetails;
