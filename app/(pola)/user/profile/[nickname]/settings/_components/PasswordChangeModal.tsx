'use client';

import { useState } from 'react';
import styles from '../page.module.css';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (currentPassword: string, newPassword: string) => Promise<void>;
}

export default function PasswordChangeModal({
  isOpen,
  onClose,
  onSubmit,
}: PasswordChangeModalProps) {
  const [passwordData, setPasswordData] = useState<{
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // 비밀번호 확인 검증
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('새 비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    try {
      await onSubmit(passwordData.currentPassword, passwordData.newPassword);

      // 성공 시 폼 초기화
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      onClose();
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>비밀번호 변경</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
              <path
                d='M18 6L6 18'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M6 6L18 18'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>
        </div>

        <div className={styles.modalContent}>
          <div className={styles.formField}>
            <label className={styles.label}>현재 비밀번호</label>
            <input
              type='password'
              value={passwordData.currentPassword}
              onChange={(e) =>
                handlePasswordChange('currentPassword', e.target.value)
              }
              className={styles.input}
            />
          </div>

          <div className={styles.formField}>
            <label className={styles.label}>새 비밀번호</label>
            <input
              type='password'
              value={passwordData.newPassword}
              onChange={(e) =>
                handlePasswordChange('newPassword', e.target.value)
              }
              className={styles.input}
            />
          </div>

          <div className={styles.formField}>
            <label className={styles.label}>새 비밀번호 확인</label>
            <input
              type='password'
              value={passwordData.confirmPassword}
              onChange={(e) =>
                handlePasswordChange('confirmPassword', e.target.value)
              }
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={onClose}>
            취소
          </button>
          <button className={styles.confirmButton} onClick={handleSubmit}>
            비밀번호 변경
          </button>
        </div>
      </div>
    </div>
  );
}
