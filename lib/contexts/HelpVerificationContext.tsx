'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface HelpVerificationContextType {
  // 시니어 인증번호 모달
  seniorModalState: {
    isOpen: boolean;
    helpId: number | null;
    helpTitle: string;
    verificationCode: number | null;
    isCompleted: boolean;
    isLoading: boolean;
  };
  openSeniorVerificationCodeModal: (
    helpId: number,
    helpTitle: string,
    verificationCode: number
  ) => void;
  closeSeniorVerificationCodeModal: () => void;
  setHelpCompleted: (helpId: number, helpTitle: string) => void;
  setLoading: (isLoading: boolean) => void;
}

const HelpVerificationContext = createContext<
  HelpVerificationContextType | undefined
>(undefined);

export function HelpVerificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [seniorModalState, setSeniorModalState] = useState({
    isOpen: false,
    helpId: null as number | null,
    helpTitle: '',
    verificationCode: null as number | null,
    isCompleted: false,
    isLoading: false,
  });

  const openSeniorVerificationCodeModal = useCallback(
    (helpId: number, helpTitle: string, verificationCode: number) => {
      setSeniorModalState({
        isOpen: true,
        helpId,
        helpTitle,
        verificationCode,
        isCompleted: false, // 명시적으로 false로 초기화
        isLoading: false,
      });
    },
    []
  );

  const closeSeniorVerificationCodeModal = useCallback(() => {
    setSeniorModalState({
      isOpen: false,
      helpId: null,
      helpTitle: '',
      verificationCode: null,
      isCompleted: false,
      isLoading: false,
    });
  }, []);

  const setHelpCompleted = useCallback((helpId: number, helpTitle: string) => {
    setSeniorModalState((prev) => ({
      ...prev,
      isCompleted: true,
      helpId,
      helpTitle,
    }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setSeniorModalState((prev) => ({
      ...prev,
      isLoading,
    }));
  }, []);

  const value = {
    seniorModalState,
    openSeniorVerificationCodeModal,
    closeSeniorVerificationCodeModal,
    setHelpCompleted,
    setLoading,
  };

  return (
    <HelpVerificationContext.Provider value={value}>
      {children}
    </HelpVerificationContext.Provider>
  );
}

export function useHelpVerification() {
  const context = useContext(HelpVerificationContext);
  if (context === undefined) {
    throw new Error(
      'useHelpVerification must be used within a HelpVerificationProvider'
    );
  }
  return context;
}
