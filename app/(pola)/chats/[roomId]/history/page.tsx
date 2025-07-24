'use client';

import { useState, useEffect } from 'react';
import { useUserProfile } from '@/lib/hooks';
import { useAuthStore } from '@/lib/stores/authStore';
import styles from './History.module.css';
import Image from 'next/image';
import DummyUser from '@/public/images/dummies/dummy_user.png';
import HelpListCard from '@/app/_components/commons/list-card/help-list-card/HelpListCard';
import type { HelpListResponseDto } from '@/backend/helps/applications/dtos/HelpDTO';
import Link from 'next/link';
import { useChatRoomDetailWithHelps } from '@/lib/hooks/chats';
import { useUserReviewStats } from '@/lib/hooks/review';

interface PageProps {
  params: Promise<{ roomId: string }>;
}

export default function ChatHistoryPage({ params }: PageProps) {
  const [roomId, setRoomId] = useState<number>(0);
  const { data } = useChatRoomDetailWithHelps(roomId);
  const { user } = useAuthStore();

  useEffect(() => {
    const initializePage = async () => {
      try {
        const { roomId } = await params;
        setRoomId(Number(roomId));
      } catch {
        // 에러 무시
      }
    };
    initializePage();
  }, [params]);

  const helps = data?.helps || [];

  // 상대방 nickname 결정 (로그인한 사용자가 아닌 상대방)
  const opponentNickname =
    data?.juniorNickname === user?.nickname
      ? data?.seniorNickname
      : data?.juniorNickname;

  // 상대방 프로필 정보 조회
  const { data: opponentProfile } = useUserProfile(opponentNickname || '');

  // 상대방 리뷰 통계 조회
  const { data: reviewStats } = useUserReviewStats(opponentNickname || '');

  // ConnectedHelpDto를 HelpListResponseDto로 변환
  const convertedHelps: HelpListResponseDto[] = helps.map((help) => ({
    id: help.id,
    seniorInfo: {
      nickname: opponentNickname || '',
      name: opponentProfile?.data?.name || opponentNickname || '',
      userRole: 'senior' as const,
      profileImgUrl: opponentProfile?.data?.profileImgUrl || '',
      address: opponentProfile?.data?.address || '',
    },
    title: help.title,
    startDate: help.startDate,
    endDate: help.endDate,
    category: help.category,
    content: '', // 채팅방 히스토리에서는 content가 없으므로 빈 문자열
    status: 'completed', // 채팅방 히스토리는 완료된 help들
    createdAt: help.createdAt,
    images: help.representativeImage ? [help.representativeImage] : [],
  }));

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <span className={styles.title}>이전 help 기록</span>
      </div>
      <div className={styles.profileBox}>
        <Link href={`/user/profile/${opponentNickname}`}>
          <div className={styles.profileImg}>
            <Image
              src={opponentProfile?.data?.profileImgUrl || DummyUser}
              alt='Profile'
              width={64}
              height={64}
              className={styles.profileImage}
            />
          </div>
        </Link>
        <div className={styles.profileInfo}>
          <div className={styles.profileName}>
            {opponentProfile?.data?.name || opponentNickname}
          </div>
          <div className={styles.profileRating}>
            <span className={styles.stars}>
              {'★'.repeat(Math.round(reviewStats?.averageRating || 0))}
              {'☆'.repeat(5 - Math.round(reviewStats?.averageRating || 0))}
            </span>
            <span className={styles.ratingNum}>
              ({reviewStats?.reviewCount || 0}개)
            </span>
          </div>
        </div>
      </div>
      <div className={styles.helpList}>
        {convertedHelps.map((help) => (
          <HelpListCard key={help.id} help={help} />
        ))}
      </div>
    </div>
  );
}
