'use client';

import { useState, useEffect, useCallback } from 'react';
import { useNotificationPermission } from '@/lib/hooks/useNotificationPermission';
import { useSeniorHelpCompletion } from '@/lib/hooks/useSeniorHelpCompletion';
import styles from './page.module.css';
import { useHelpVerification } from '@/lib/contexts/HelpVerificationContext';

interface Help {
  id: number;
  title: string;
  seniorInfo: {
    nickname: string;
  };
}

export default function VerificationTestPage() {
  const { openSeniorVerificationCodeModal } = useHelpVerification();
  const { permission, sendNotification } = useNotificationPermission();
  const {
    requestCompletion,
    isPending: isCompletionPending,
    error: completionError,
  } = useSeniorHelpCompletion();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [helps, setHelps] = useState<Help[]>([]);
  const [selectedHelpId, setSelectedHelpId] = useState<number>(1);
  const [isLoadingHelps, setIsLoadingHelps] = useState(true);

  // Help 목록 가져오기
  const fetchHelps = useCallback(async () => {
    try {
      const response = await fetch('/api/helps');
      if (response.ok) {
        const data = await response.json();
        setHelps(data);
        if (data.length > 0) {
          setSelectedHelpId(data[0].id);
        }
      }
    } catch (error) {
      console.error('Help 목록 가져오기 실패:', error);
    } finally {
      setIsLoadingHelps(false);
    }
  }, []);

  useEffect(() => {
    fetchHelps();
  }, [fetchHelps]);

  // 모달 테스트
  const handleTestModal = useCallback(() => {
    const selectedHelp = helps.find((h) => h.id === selectedHelpId);
    openSeniorVerificationCodeModal(
      selectedHelpId,
      selectedHelp?.title || '테스트 Help',
      123456
    );
  }, [helps, selectedHelpId, openSeniorVerificationCodeModal]);

  // 알림 테스트
  const handleTestNotification = useCallback(() => {
    sendNotification('테스트 알림', {
      body: '이것은 테스트 알림입니다.',
      icon: '/images/logos/POLAR.png',
    });
  }, [sendNotification]);

  // 인증번호 생성 테스트
  const handleGenerateCode = useCallback(() => {
    setIsGenerating(true);
    setGeneratedCode(null); // Clear previous code

    // 6자리 랜덤 숫자 생성
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);

    setTimeout(() => {
      setIsGenerating(false);
    }, 1000);
  }, []);

  // 시니어 완료 요청 테스트
  const handleSeniorCompletion = useCallback(async () => {
    const selectedHelp = helps.find((h) => h.id === selectedHelpId);
    if (!selectedHelp) return;

    const result = await requestCompletion({
      helpId: selectedHelpId,
      helpTitle: selectedHelp.title,
    });

    if (result.success) {
      console.log('✅ 시니어 완료 요청 성공:', result);
    } else {
      console.error('❌ 시니어 완료 요청 실패:', result.error);
    }
  }, [helps, selectedHelpId, requestCompletion]);

  if (isLoadingHelps) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Help 목록을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Help 인증 시스템 테스트</h1>

      <div className={styles.section}>
        <h2>Help 선택</h2>
        <select
          value={selectedHelpId}
          onChange={(e) => setSelectedHelpId(Number(e.target.value))}
          className={styles.select}
        >
          {helps.map((help) => (
            <option key={help.id} value={help.id}>
              {help.title} (ID: {help.id})
            </option>
          ))}
        </select>
      </div>

      <div className={styles.section}>
        <h2>시니어 완료 요청</h2>
        <p>시니어 역할로 Help 완료를 요청하고 인증번호를 생성합니다.</p>
        <button
          onClick={handleSeniorCompletion}
          className={styles.button}
          disabled={isCompletionPending || helps.length === 0}
        >
          {isCompletionPending ? '요청 중...' : '시니어 완료 요청'}
        </button>
        {completionError && (
          <div className={styles.error}>오류: {completionError}</div>
        )}
      </div>

      <div className={styles.section}>
        <h2>인증번호 생성</h2>
        <p>테스트용 인증번호를 생성합니다.</p>
        <button
          onClick={handleGenerateCode}
          className={styles.button}
          disabled={isGenerating}
        >
          {isGenerating ? '생성 중...' : '인증번호 생성'}
        </button>
        {generatedCode && (
          <div className={styles.generatedCode}>
            생성된 인증번호: <strong>{generatedCode}</strong>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h2>모달 테스트</h2>
        <p>주니어 역할로 인증번호 입력 모달을 테스트합니다.</p>
        <button
          onClick={handleTestModal}
          className={styles.button}
          disabled={helps.length === 0}
        >
          인증번호 모달 열기
        </button>
      </div>

      <div className={styles.section}>
        <h2>알림 테스트</h2>
        <button
          onClick={handleTestNotification}
          className={styles.button}
          disabled={permission !== 'granted'}
        >
          테스트 알림 보내기
        </button>
        {permission !== 'granted' && (
          <p className={styles.warning}>
            알림 권한이 필요합니다. 브라우저 설정에서 알림을 허용해주세요.
          </p>
        )}
      </div>

      <div className={styles.section}>
        <h2>실시간 테스트</h2>
        <p>실시간 기능을 테스트하려면:</p>
        <ol className={styles.instructions}>
          <li>
            위의 &ldquo;시니어 완료 요청&rdquo; 버튼을 클릭하여 인증번호 생성 및
            모달 표시
          </li>
          <li>
            또는 &ldquo;인증번호 생성&rdquo; 버튼을 클릭하여 인증번호 생성
          </li>
          <li>생성된 인증번호를 복사</li>
          <li>&ldquo;인증번호 모달 열기&rdquo; 버튼을 클릭하여 모달 열기</li>
          <li>복사한 인증번호를 입력하여 테스트</li>
        </ol>
        <p className={styles.note}>
          <strong>참고:</strong> 실제 실시간 테스트를 위해서는 다른 브라우저나
          시크릿 모드에서 시니어로 로그인 후 Help 완료 요청을 해야 합니다.
        </p>
      </div>
    </div>
  );
}
