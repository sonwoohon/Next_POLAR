'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { useReviewAccess } from '@/lib/hooks/useReviewAccess';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // 로그인/회원가입 페이지인지 확인
  const isAuthPage = pathname === '/login' || pathname === '/sign-up';

  // 리뷰 생성 페이지인지 확인
  const isReviewCreatePage = pathname.match(/^\/helps\/[0-9]+\/create-review/);

  // helps/create 페이지인지 확인
  const isHelpCreatePage = pathname === '/helps/create';

  // 프로필 편집 페이지인지 확인
  const isProfileEditPage = pathname.match(/^\/user\/profile\/[^\/]+\/edit$/);

  // 리뷰 생성 권한 확인 (nickname이 있을 때만)
  const {
    data: hasAccess,
    isLoading,
    error,
  } = useReviewAccess({
    nickname: user?.nickname || '',
    helpId: isReviewCreatePage
      ? Number(params.helpId || pathname.split('/')[2])
      : 0,
  });

  useEffect(() => {
    // Zustand persist가 초기화된 후에만 체크
    if (isAuthenticated !== undefined) {
      setIsInitialized(true);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isInitialized) return; // 초기화 전에는 리다이렉트하지 않음

    // 로그인/회원가입 페이지에서는 인증 체크 건너뛰기
    if (isAuthPage) return;

    // 로그인하지 않은 경우에만 리다이렉트
    if (!isAuthenticated || !user) {
      router.replace('/login');
      return;
    }
  }, [isInitialized, isAuthenticated, user, router, isAuthPage]);

  useEffect(() => {
    if (!isInitialized) return; // 초기화 전에는 리다이렉트하지 않음

    // 리뷰 생성 페이지에서 권한이 없으면 홈으로 리다이렉트
    if (isReviewCreatePage && !isLoading && hasAccess === false) {
      alert('리뷰를 작성할 권한이 없습니다.');
      router.replace('/');
    }
  }, [isInitialized, isReviewCreatePage, isLoading, hasAccess, router]);

  useEffect(() => {
    if (!isInitialized) return; // 초기화 전에는 리다이렉트하지 않음

    // helps/create 페이지에서 senior가 아닌 경우 홈으로 리다이렉트
    if (isHelpCreatePage && user?.role !== 'senior') {
      alert('시니어만 도움말을 생성할 수 있습니다.');
      router.replace('/');
    }
  }, [isInitialized, isHelpCreatePage, user?.role, router]);

  useEffect(() => {
    if (!isInitialized) return; // 초기화 전에는 리다이렉트하지 않음

    // 프로필 편집 페이지에서 본인의 프로필이 아닌 경우 홈으로 리다이렉트
    if (isProfileEditPage) {
      const urlNickname = pathname.split('/')[3]; // /user/profile/[nickname]/edit에서 nickname 추출
      if (user?.nickname !== urlNickname) {
        alert('본인의 프로필만 수정할 수 있습니다.');
        router.replace('/');
      }
    }
  }, [isInitialized, isProfileEditPage, user?.nickname, pathname, router]);

  // 로그인/회원가입 페이지에서는 인증 체크 없이 렌더링
  if (isAuthPage) {
    return <>{children}</>;
  }

  // 초기화 전에는 로딩 상태
  if (!isInitialized) return null;
  if (!isAuthenticated || !user) return null;
  if (isReviewCreatePage && isLoading) return null; // 권한 확인 중
  if (isReviewCreatePage && hasAccess === false) return null; // 권한이 없으면 렌더링하지 않음
  if (isHelpCreatePage && user?.role !== 'senior') return null; // senior가 아니면 렌더링하지 않음
  if (isProfileEditPage && user?.nickname !== pathname.split('/')[3])
    return null; // 본인의 프로필이 아니면 렌더링하지 않음

  return <>{children}</>;
}
