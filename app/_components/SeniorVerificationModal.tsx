'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './commons/HelpVerificationModal.module.css';

interface SeniorVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  helpId: number;
  helpTitle: string;
  verificationCode: number;
  isCompleted?: boolean;
  isLoading?: boolean;
}

export default function SeniorVerificationModal({
  isOpen,
  onClose,
  helpId,
  helpTitle,
  verificationCode,
  isCompleted = false,
  isLoading = false,
}: SeniorVerificationModalProps) {
  const [showCompleted, setShowCompleted] = useState(false);
  const router = useRouter();

  // isCompleted prop이 변경되면 완료 상태로 변경
  useEffect(() => {
    if (isCompleted) {
      setShowCompleted(true);
    }
  }, [isCompleted]);

  const handleClose = () => {
    onClose();
  };

  const handleReviewClick = () => {
    router.push(`/helps/${helpId}/create-review`);
    handleClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {showCompleted ? 'Help 완료' : '인증번호 생성 완료'}
          </h2>
          <button
            type='button'
            className={styles.closeButton}
            onClick={handleClose}
            aria-label='닫기'
          >
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          {isLoading ? (
            <div className={styles.loadingContent}>
              <div className={styles.loadingSpinner}></div>
              <h3 className={styles.loadingTitle}>처리 중...</h3>
              <p className={styles.loadingMessage}>잠시만 기다려주세요.</p>
            </div>
          ) : !showCompleted ? (
            <>
              <div className={styles.helpInfo}>
                <h3>Help 정보</h3>
                <p>
                  <strong>제목:</strong> {helpTitle}
                </p>
                <p>
                  <strong>Help ID:</strong> {helpId}
                </p>
              </div>

              <div className={styles.verificationCodeSection}>
                <h3>생성된 인증번호</h3>
                <div className={styles.verificationCodeDisplay}>
                  {verificationCode}
                </div>
                <p className={styles.verificationCodeNote}>
                  주니어에게 인증번호 입력 모달이 자동으로 표시됩니다.
                </p>
              </div>

              <div className={styles.buttonGroup}>
                <button
                  type='button'
                  className={styles.closeModalButton}
                  onClick={handleClose}
                >
                  닫기
                </button>
              </div>
            </>
          ) : (
            <div className={styles.completedContent}>
              <div className={styles.successIcon}>✓</div>
              <h3 className={styles.completedTitle}>Help가 완료되었습니다!</h3>
              <p className={styles.completedMessage}>
                주니어가 인증번호를 성공적으로 입력했습니다.
              </p>
              <div className={styles.buttonGroup}>
                <button
                  onClick={handleReviewClick}
                  className={styles.reviewButton}
                >
                  리뷰 작성하기
                </button>
                <button onClick={handleClose} className={styles.cancelButton}>
                  닫기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
