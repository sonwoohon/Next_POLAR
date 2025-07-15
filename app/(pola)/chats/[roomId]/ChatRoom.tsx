'use client';

import { useRef, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import styles from './ChatRoom.module.css';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ChatRoomProps {
  roomId: string;
  loginUserNickname: string;
}

interface Message {
  id: number | string;
  nickname: string;
  contactRoomId: number;
  message: string;
  createdAt: Date;
}

export default function ChatRoom({ roomId, loginUserNickname }: ChatRoomProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [canSend, setCanSend] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // 스크롤 최하단
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 실시간 메시지 fetch 동기화
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
        async () => {
          setIsLoading(true);
          try {
            const res = await fetch(`/api/chats/rooms/${roomId}/messages`);
            const { messages: msgs } = await res.json();
            setMessages(
              msgs.map((m: any) => ({
                ...m,
                createdAt: new Date(m.createdAt),
              }))
            );
          } catch {
            /* ignore */
          } finally {
            setIsLoading(false);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  // 초기 메시지 로드
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/chats/rooms/${roomId}/messages`);
        const { messages: msgs } = await res.json();
        setMessages(
          msgs.map((m: any) => ({
            ...m,
            createdAt: new Date(m.createdAt),
          }))
        );
      } catch {
        /* ignore */
      } finally {
        setIsLoading(false);
      }
    })();
  }, [roomId]);

  const syncCanSend = () => {
    const text = textareaRef.current?.value.trim() || '';
    setCanSend(!!text);
  };

  // 한글 조합 중 Enter 무시
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 메시지 전송 (ref 기반 optimistic update)
  const sendMessage = async () => {
    const text = textareaRef.current?.value.trim();
    if (!text) return;

    // 입력창 초기화
    textareaRef.current!.value = '';
    setCanSend(false);

    // optimistic
    const tempId = 'temp_' + Date.now();
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        nickname: 'jelly5915',
        contactRoomId: Number(roomId),
        message: text,
        createdAt: new Date(),
      },
    ]);

    // 실제 API 호출
    try {
      const res = await fetch(`/api/chats/rooms/${roomId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) throw new Error();
    } catch {
      // 실패 시 롤백은 필요시 구현
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesContainer}>
        {isLoading ? (
          <div className={styles.loading}>메시지 로딩 중...</div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.nickname === 'jelly5915';
            return (
              <div
                key={msg.id}
                className={isMine ? styles.myMessageRow : styles.messageRow}
              >
                {!isMine && (
                  <div className={styles.avatar}>
                    <div className={styles.avatarIcon}>
                      <svg
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                      >
                        <circle cx='12' cy='9' r='4' fill='#b6d4fe' />
                        <ellipse cx='12' cy='17' rx='7' ry='4' fill='#b6d4fe' />
                      </svg>
                    </div>
                  </div>
                )}
                <div
                  className={
                    isMine ? styles.myMessageWrapper : styles.messageWrapper
                  }
                >
                  {isMine ? (
                    <>
                      <div className={styles.myMeta}>
                        <span className={styles.read}>읽음</span>
                        <span>{msg.createdAt.toLocaleTimeString()}</span>
                      </div>
                      <div className={`${styles.bubble} ${styles.myBubble}`}>
                        {msg.message}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={styles.bubble}>{msg.message}</div>
                      <div className={styles.meta}>
                        <span>{msg.createdAt.toLocaleTimeString()}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      <div className={styles.inputContainer}>
        <button className={styles.plusBtn} type='button'>
          +
        </button>
        <textarea
          ref={textareaRef}
          className={styles.messageInput}
          rows={1}
          placeholder='메시지 입력'
          onKeyDown={onKeyDown}
          onInput={syncCanSend}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => {
            setIsComposing(false);
            syncCanSend();
          }}
        />
        <button
          className={styles.sendButton}
          disabled={!canSend}
          onClick={sendMessage}
        >
          전송
        </button>
      </div>
    </div>
  );
}
