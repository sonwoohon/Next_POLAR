'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatRoom from './ChatRoom';
import styles from './page.module.css';
import Image from 'next/image';
// import ChatRoom from './ChatRoom';

interface PageProps {
  params: Promise<{ roomId: string }>;
}

export default function ChatRoomPage({ params }: PageProps) {
  const [loginUserNickname] = useState<string | null>('jelly5915');
  const [roomId, setRoomId] = useState<string | null>(null);
  const router = useRouter();

  // 임시 데이터(시니어명, 헬프 정보, 태그 등)
  const seniorName = '무슨무슨 시니어';
  const helpTitle =
    '어떤 어떤 것을 도와주시는 요구사항을 만족할 수 있도록 어떻게 어떻게 부탁드리면 안될까요?';
  const helpTags = ['방청소', '헬쓰기'];
  const helpImgUrl = '/_assets/default.jpg'; // 실제 이미지 경로로 교체

  useEffect(() => {
    const initializePage = async () => {
      try {
        const { roomId } = await params;
        // 실제 환경에서는 여기서 loginUserNickname도 fetch해서 set
        setRoomId(roomId);
      } catch {
        // 에러 무시
      }
    };
    initializePage();
  }, [params]);

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <span className={styles.logo}>POLAR</span>
        <span className={styles.spacer}></span>
        <span className={styles.bell}>🔔</span>
      </div>
      {/* 시니어명 */}
      <div className={styles.topBar}>
        <span className={styles.back} onClick={() => router.back()}>
          {'<'}
        </span>
        <span className={styles.seniorName}>{seniorName}</span>
      </div>
      {/* 헬프 정보 */}
      <div className={styles.helpInfo}>
        <Image
          className={styles.helpImg}
          src={helpImgUrl}
          alt='help'
          width={48}
          height={48}
        />
        <div className={styles.helpTextWrap}>
          <div className={styles.helpTitle}>{helpTitle}</div>
          <div className={styles.tags}>
            {helpTags.map((tag) => (
              <span className={styles.tag} key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
        <span className={styles.prevHelp}>이전 help 보기 {'>'}</span>
      </div>
      {/* 채팅 내역/입력창은 ChatRoom에서 분리 구현 */}
      {roomId && loginUserNickname && (
        <ChatRoom roomId={roomId} loginUserNickname={loginUserNickname} />
      )}
    </div>
  );
}
