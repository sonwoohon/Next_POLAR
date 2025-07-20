"use client";
import React, { useState, useEffect, useCallback } from "react";
import styles from "./Step3HelpDetails.module.css";
import ImageUploader from "../../../../_components/commons/imageUploader/ImageUploader";
import { getCategoryName } from "@/lib/utils/categoryUtils";
import {
  getRandomTitle,
  getRandomContent,
} from "@/lib/constants/categoryTemplates";

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
  const [activeTab, setActiveTab] = useState<number>(
    selectedCategories[0] || 0
  );
  const [isDirectInput, setIsDirectInput] = useState<boolean>(false);
  const [generatedSuggestions, setGeneratedSuggestions] = useState<{
    [categoryId: number]: {
      titles: string[];
      contents: string[];
    };
  }>({});

  // 카테고리별 템플릿은 이제 constants에서 가져옴

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
  const handleSuggestionClick = (type: "title" | "content", value: string) => {
    if (type === "title") {
      onTitleChange(value);
    } else {
      onContentChange(value);
    }
  };
  return (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>
        3단계 도움받고 싶은 내용을 입력해주세요
      </h2>

      {/* 토글 버튼 */}
      <div className={styles.toggleContainer}>
        <button
          className={`${styles.toggleButton} ${
            !isDirectInput ? styles.toggleButtonActive : ""
          }`}
          onClick={() => setIsDirectInput(false)}
        >
          💡 제안 선택
        </button>
        <button
          className={`${styles.toggleButton} ${
            isDirectInput ? styles.toggleButtonActive : ""
          }`}
          onClick={() => setIsDirectInput(true)}
        >
          ✏️ 직접 입력
        </button>
      </div>

      {!isDirectInput ? (
        // 제안 선택 모드
        <div className={styles.suggestionsMode}>
          {/* 카테고리 탭 */}
          {selectedCategories.length > 1 && (
            <div className={styles.tabContainer}>
              {selectedCategories.map((categoryId) => (
                <button
                  key={categoryId}
                  className={`${styles.tabButton} ${
                    activeTab === categoryId ? styles.tabButtonActive : ""
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
            <div className={styles.suggestionsSection}>
              <div className={styles.suggestionGroup}>
                <h3 className={styles.suggestionTitle}>제목 선택</h3>
                <div className={styles.suggestionButtons}>
                  {generatedSuggestions[activeTab].titles.map(
                    (suggestion, index) => (
                      <button
                        key={index}
                        className={styles.suggestionButton}
                        onClick={() =>
                          handleSuggestionClick("title", suggestion)
                        }
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
                        onClick={() =>
                          handleSuggestionClick("content", suggestion)
                        }
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
      ) : (
        // 직접 입력 모드
        <div className={styles.directInputMode}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>도움 제목</label>
            <input
              type="text"
              className={styles.textInput}
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="요청 제목을 입력해주세요."
              maxLength={50}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>도움 내용</label>
            <textarea
              className={`${styles.textInput} ${styles.textArea}`}
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              placeholder="도움이 필요한 시간, 장소, 이유를 자유롭게 적어주세요."
              maxLength={500}
            />
            <div className={styles.charCount}>{content.length}/500</div>
          </div>
        </div>
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
