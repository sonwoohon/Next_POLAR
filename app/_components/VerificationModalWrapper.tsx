'use client';

import { useState } from 'react';
import { useVerificationRealtime } from '@/lib/hooks';
import { useHelpVerification } from '@/lib/contexts/HelpVerificationContext';

import VerificationModal from './VerificationModal';
import SeniorVerificationModal from './SeniorVerificationModal';

export default function VerificationModalWrapper() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    helpId: number | null;
    helpTitle: string;
    isCompleted: boolean;
  }>({
    isOpen: false,
    helpId: null,
    helpTitle: '',
    isCompleted: false,
  });

  const {
    seniorModalState,
    closeSeniorVerificationCodeModal,
    setHelpCompleted,
    setLoading,
  } = useHelpVerification();

  const handleVerificationReceived = (helpId: number, helpTitle: string) => {
    setModalState({
      isOpen: true,
      helpId,
      helpTitle,
      isCompleted: false,
    });
  };

  const handleHelpCompleted = (
    helpId: number,
    helpTitle: string,
    userRole: 'senior' | 'junior'
  ) => {
    // 주니어가 인증번호를 입력했을 때만 처리
    if (userRole === 'junior') {
      // 주니어 모달이 열려있으면 완료 상태로 변경
      if (modalState.isOpen && modalState.helpId === helpId) {
        setModalState((prev) => ({
          ...prev,
          isCompleted: true,
        }));
      }
    } else if (userRole === 'senior') {
      // 시니어 모달이 열려있고, 해당 Help의 인증번호가 표시되어 있을 때만 완료 상태로 변경
      if (
        seniorModalState.isOpen &&
        seniorModalState.helpId === helpId &&
        seniorModalState.verificationCode
      ) {
        setHelpCompleted(helpId, helpTitle);
      }
    }
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      helpId: null,
      helpTitle: '',
      isCompleted: false,
    });
  };

  // 실시간 인증번호 알림 구독
  useVerificationRealtime({
    onVerificationReceived: handleVerificationReceived,
    onHelpCompleted: handleHelpCompleted,
    onLoadingChange: setLoading,
  });

  return (
    <>
      {/* 주니어 인증번호 입력 모달 */}
      <VerificationModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        helpId={modalState.helpId || 0}
        helpTitle={modalState.helpTitle}
        isCompleted={modalState.isCompleted}
      />

      {/* 시니어 인증번호 표시 모달 */}
      {seniorModalState.isOpen &&
        seniorModalState.helpId &&
        seniorModalState.verificationCode && (
          <SeniorVerificationModal
            isOpen={seniorModalState.isOpen}
            onClose={closeSeniorVerificationCodeModal}
            helpId={seniorModalState.helpId}
            helpTitle={seniorModalState.helpTitle}
            verificationCode={seniorModalState.verificationCode}
            isCompleted={seniorModalState.isCompleted}
            isLoading={seniorModalState.isLoading}
          />
        )}
    </>
  );
}
