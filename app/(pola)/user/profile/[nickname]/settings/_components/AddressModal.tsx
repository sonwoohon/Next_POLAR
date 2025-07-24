'use client';

import { useRef, useEffect } from 'react';
import DaumPostcode, { Address } from 'react-daum-postcode';
import styles from '../page.module.css';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (address: string) => void;
}

export default function AddressModal({
  isOpen,
  onClose,
  onComplete,
}: AddressModalProps) {
  const daumPostcodeRef = useRef<HTMLDivElement>(null);

  const handleComplete = (data: Address) => {
    onComplete(data.address);
    onClose();
  };

  useEffect(() => {
    if (isOpen && daumPostcodeRef.current) {
      daumPostcodeRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal} ref={daumPostcodeRef} tabIndex={-1}>
        <div className={styles.modalHeader}>
          <h2>주소 검색</h2>
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
          <DaumPostcode onComplete={handleComplete} />
        </div>
      </div>
    </div>
  );
}
