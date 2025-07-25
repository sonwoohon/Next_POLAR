'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { getCategoryName } from '@/lib/utils/categoryUtils';
import {
  getRandomTitle,
  getRandomContent,
} from '@/lib/constants/categoryTemplates';
import styles from './Step3HelpDetails.module.css';

interface SuggestionModeProps {
  title: string;
  content: string;
  selectedCategories: number[];
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
}

const SuggestionMode: React.FC<SuggestionModeProps> = ({
  title,
  content,
  selectedCategories,
  onTitleChange,
  onContentChange,
}) => {
  const [activeTab, setActiveTab] = useState<number>(
    selectedCategories[0] || 0
  );
  const [generatedSuggestions, setGeneratedSuggestions] = useState<{
    [categoryId: number]: {
      titles: string[];
      contents: string[];
    };
  }>({});

  // 랜덤 제목과 내용 생성
  const generateRandomSuggestions = useCallback(() => {
    if (selectedCategories.length === 0) return;

    const newSuggestions: {
      [categoryId: number]: { titles: string[]; contents: string[] };
    } = {};

    // 각 카테고리별로 3개의 제목과 내용 생성
    selectedCategories.forEach((categoryId) => {
      const titles: string[] = [];
      const contents: string[] = [];

      // 각 카테고리에서 3개씩 랜덤 선택
      for (let i = 0; i < 3; i++) {
        const title = getRandomTitle(categoryId);
        const content = getRandomContent(categoryId);

        if (title && !titles.includes(title)) {
          titles.push(title);
        }
        if (content && !contents.includes(content)) {
          contents.push(content);
        }
      }

      newSuggestions[categoryId] = {
        titles: titles.slice(0, 3),
        contents: contents.slice(0, 3),
      };
    });

    setGeneratedSuggestions(newSuggestions);
  }, [selectedCategories]);

  // 컴포넌트 마운트 시와 카테고리 변경 시 랜덤 제안 생성
  useEffect(() => {
    generateRandomSuggestions();
  }, [generateRandomSuggestions]);

  // 제안된 제목이나 내용을 클릭했을 때 적용
  const handleSuggestionClick = (type: 'title' | 'content', value: string) => {
    if (type === 'title') {
      onTitleChange(value);
    } else {
      onContentChange(value);
    }
  };

  return (
    <div className={styles.suggestionsMode}>
      {/* 카테고리 탭 */}
      {selectedCategories.length > 1 && (
        <div className={styles.tabContainer}>
          {selectedCategories.map((categoryId) => (
            <button
              key={categoryId}
              className={`${styles.tabButton} ${
                activeTab === categoryId ? styles.tabButtonActive : ''
              }`}
              onClick={() => setActiveTab(categoryId)}
            >
              {getCategoryName(categoryId)}
            </button>
          ))}
        </div>
      )}

      {/* 선택된 카테고리의 제안 */}
      {activeTab > 0 && generatedSuggestions[activeTab] && (
        <div>
          <div className={styles.suggestionGroup}>
            <h3 className={styles.suggestionTitle}>제목 선택</h3>
            <div className={styles.suggestionButtons}>
              {generatedSuggestions[activeTab].titles.map(
                (suggestion, index) => (
                  <button
                    key={index}
                    className={styles.suggestionButton}
                    onClick={() => handleSuggestionClick('title', suggestion)}
                  >
                    {suggestion}
                  </button>
                )
              )}
            </div>
          </div>

          <div className={styles.suggestionGroup}>
            <h3 className={styles.suggestionTitle}>내용 선택</h3>
            <div className={styles.suggestionButtons}>
              {generatedSuggestions[activeTab].contents.map(
                (suggestion, index) => (
                  <button
                    key={index}
                    className={styles.suggestionButton}
                    onClick={() => handleSuggestionClick('content', suggestion)}
                  >
                    {suggestion}
                  </button>
                )
              )}
            </div>
          </div>

          {/* 선택된 제목과 내용 미리보기 */}
          {(title || content) && (
            <div className={styles.previewSection}>
              <h3 className={styles.previewTitle}>선택된 내용 미리보기</h3>
              {title && (
                <div className={styles.previewItem}>
                  <strong>제목:</strong> {title}
                </div>
              )}
              {content && (
                <div className={styles.previewItem}>
                  <strong>내용:</strong> {content}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SuggestionMode;
