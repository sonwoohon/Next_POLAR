'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useSeniorHelpCompletion } from '@/lib/hooks/useSeniorHelpCompletion';
import { useAuthStore } from '@/lib/stores/authStore';
import { useHelpDetail, useApplyHelp, useHelpApplicationStatus } from '@/lib/hooks/help';
import TopBar from './_components/top-bar/TopBar';
import ImageCarousel from './_components/image-carousel/ImageCarousel';
import HelpContent from './_components/help-content/HelpContent';
import ActionButtons from './_components/action-buttons/ActionButtons';
import UserInfoSection from '@/app/_components/commons/common-sections/user-info/UserInfoSection';
import styles from './HelpDetail.module.css';

export default function HelpDetailPage({
  params,
}: {
  params: Promise<{ helpId: string }>;
}) {
  const { helpId } = use(params);
  const router = useRouter();

  // React Query를 사용하여 헬프 데이터 가져오기
  const { data: helpData, isLoading, error: helpError } = useHelpDetail(parseInt(helpId));

  // 시니어 완료 요청 훅 사용
  const { requestCompletion, isPending: isCompleting } = useSeniorHelpCompletion();

  // 헬프 지원 훅 사용
  const { mutate: applyHelp, isPending: isApplying } = useApplyHelp();

  // AuthStore에서 사용자 정보 가져오기
  const user = useAuthStore((state) => state.user);

  // 사용자 역할
  const userRole = user?.role as 'junior' | 'senior' | null;

  // 지원 상태 확인 훅 사용 (주니어인 경우에만)
  const { data: applicationStatus } = useHelpApplicationStatus(
    userRole === 'junior' ? parseInt(helpId) : 0
  );
  
  // Help 완료 요청 함수 (새로운 훅 사용)
  const handleCompleteHelp = () => {
    if (!helpData) {
      console.log('❌ Help 데이터가 없음');
      return;
    }
    console.log('📋 Help 데이터:', helpData);
    requestCompletion({ helpId: helpData.id, helpTitle: helpData.title });
  };

  // 헬프 지원 함수
  const handleApplyHelp = () => {
    if (!helpData) {
      console.log('❌ Help 데이터가 없음');
      return;
    }
    console.log('📋 헬프 지원:', helpData.id);
    applyHelp(helpData.id);
  };

  // 지원자 확인 함수
  const handleCheckApplicants = () => {
    router.push(`/helps/${helpId}/applicants`);
  };



  if (isLoading) {
    return <div className={styles.loadingContainer}>로딩 중...</div>;
  }
  if (helpError) {
    return <div className={styles.errorContainer}>오류: {helpError?.message}</div>;
  }

  return (
    <div className={styles.helpDetailContainer}>
      <TopBar />
      <ImageCarousel images={helpData?.images || []} />
      {helpData?.seniorInfo && <UserInfoSection data={helpData.seniorInfo} />}
      <HelpContent help={helpData || null} />
      <ActionButtons
        help={helpData || null}
        role={userRole}
        isCompleting={isCompleting}
        isApplying={isApplying}
        applicationStatus={applicationStatus}
        onCompleteHelp={handleCompleteHelp}
        onApplyHelp={handleApplyHelp}
        onCheckApplicants={handleCheckApplicants}
      />
    </div>
  );
}
