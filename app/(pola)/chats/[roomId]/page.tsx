'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatRoom from './ChatRoom';

interface PageProps {
  params: Promise<{ roomId: string }>;
}

export default function ChatRoomPage({ params }: PageProps) {
  const [currentUserNickname, setCurrentUserNickname] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initializePage = async () => {
      try {
        // params에서 roomId 가져오기
        const { roomId: resolvedRoomId } = await params;
        setRoomId(resolvedRoomId);

        // 로그인 상태 확인 및 사용자 정보 가져오기
        const response = await fetch('/api/users');
        if (response.ok) {
          const userData = await response.json();
          setCurrentUserNickname(userData.nickname);
        } else {
          console.log('로그인되지 않음');
          router.push('/login');
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error('페이지 초기화 오류:', error);
        setError('페이지 로드 중 오류가 발생했습니다.');
        setIsLoading(false);
      }
    };

    initializePage();
  }, [params, router]);

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
        }}
      >
        <p>채팅방을 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
        }}
      >
        <p style={{ color: 'red', marginBottom: '20px' }}>오류: {error}</p>
        <button
          onClick={() => router.push('/test-chat')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          채팅 목록으로 돌아가기
        </button>
      </div>
    );
  }

  if (!currentUserNickname || !roomId) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
        }}
      >
        <p>사용자 정보를 불러올 수 없습니다.</p>
        <button
          onClick={() => router.push('/login')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px',
          }}
        >
          로그인 페이지로
        </button>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ChatRoom roomId={roomId} currentUserNickname={currentUserNickname} />
    </div>
  );
}
