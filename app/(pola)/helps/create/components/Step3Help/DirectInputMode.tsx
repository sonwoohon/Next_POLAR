'use client';
import React from 'react';
import styles from './Step3HelpDetails.module.css';

interface DirectInputModeProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
}

const DirectInputMode: React.FC<DirectInputModeProps> = ({
  title,
  content,
  onTitleChange,
  onContentChange,
}) => {
  return (
    <div className={styles.directInputMode}>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>도움 제목</label>
        <input
          type='text'
          className={styles.textInput}
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder='요청 제목을 입력해주세요.'
          maxLength={50}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>도움 내용</label>
        <textarea
          className={`${styles.textInput} ${styles.textArea}`}
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder='도움이 필요한 시간, 장소, 이유를 자유롭게 적어주세요.'
          maxLength={500}
        />
        <div className={styles.charCount}>{content.length}/500</div>
      </div>
    </div>
  );
};

export default DirectInputMode;
