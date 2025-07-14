'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import styles from './ChatRoom.module.css';

// Supabase 클라이언트 설정
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ChatRoomProps {
  roomId: string;
  currentUserNickname: string;
}

interface Message {
  id: number;
  senderNickname: string; // 닉네임 기반
  contactRoomId: number;
  message: string;
  createdAt: Date;
}

export default function ChatRoom({
  roomId,
  currentUserNickname,
}: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 자동 스크롤 함수
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 실시간 메시지 구독
  useEffect(() => {
    const channel = supabase
      .channel(`chat_room_${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'contact_messages',
          filter: `contact_room_id=eq.${roomId}`,
        },
        async (payload) => {
          console.log('새 메시지 수신:', payload);

          // 새 메시지의 작성자 닉네임 가져오기
          const senderNickname = await getSenderNickname(payload.new.sender_id);

          const newMessage: Message = {
            id: payload.new.id,
            senderNickname,
            contactRoomId: payload.new.contact_room_id,
            message: payload.new.message,
            createdAt: new Date(payload.new.created_at),
          };

          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  // 기존 메시지 로드
  const loadMessages = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/chats/rooms/${roomId}/messages`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '메시지 로드 실패');
      }

      // 닉네임이 이미 포함된 메시지 데이터 사용
      const messagesWithNicknames = data.messages.map(
        (msg: {
          id: number;
          senderNickname: string;
          contactRoomId: number;
          message: string;
          createdAt: string;
        }) => ({
          ...msg,
          createdAt: new Date(msg.createdAt),
        })
      );

      setMessages(messagesWithNicknames);
    } catch (err) {
      console.error('메시지 로드 오류:', err);
      setError(
        err instanceof Error
          ? err.message
          : '메시지 로드 중 오류가 발생했습니다.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 새 메시지 전송
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setError(null);
      const messageToSend = newMessage.trim();
      setNewMessage(''); // 입력창 비우기

      const response = await fetch(`/api/chats/rooms/${roomId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageToSend }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '메시지 전송 실패');
      }

      // 메시지 전송 성공 시 실시간 업데이트를 기다림
      console.log('메시지 전송 성공:', data);
    } catch (err) {
      console.error('메시지 전송 오류:', err);
      setError(
        err instanceof Error
          ? err.message
          : '메시지 전송 중 오류가 발생했습니다.'
      );
      // 전송 실패 시 입력창에 다시 넣기
      setNewMessage(newMessage);
    }
  };

  // UUID로 닉네임 가져오기 (헬퍼 함수)
  const getSenderNickname = async (senderId: string): Promise<string> => {
    try {
      const response = await fetch(`/api/users/${senderId}`);
      if (response.ok) {
        const data = await response.json();
        return data.nickname || '알 수 없음';
      }
      return '알 수 없음';
    } catch (error) {
      console.error('닉네임 가져오기 오류:', error);
      return '알 수 없음';
    }
  };

  // 컴포넌트 마운트 시 메시지 로드
  useEffect(() => {
    loadMessages();
  }, [roomId]);

  // Enter 키로 메시지 전송
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        <h2>채팅방 {roomId}</h2>
        <p>현재 사용자: {currentUserNickname}</p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.messagesContainer}>
        {isLoading ? (
          <div className={styles.loading}>메시지 로딩 중...</div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${
                message.senderNickname === currentUserNickname
                  ? styles.myMessage
                  : styles.otherMessage
              }`}
            >
              <div className={styles.messageContent}>
                {message.senderNickname !== currentUserNickname && (
                  <div className={styles.senderName}>
                    {message.senderNickname}
                  </div>
                )}
                <div className={styles.messageText}>{message.message}</div>
                <div className={styles.messageTime}>
                  {message.createdAt.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputContainer}>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder='메시지를 입력하세요...'
          className={styles.messageInput}
          rows={3}
        />
        <button
          onClick={sendMessage}
          disabled={!newMessage.trim()}
          className={styles.sendButton}
        >
          전송
        </button>
      </div>
    </div>
  );
}
