'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/backend/common/utils/supabaseClient';

interface Message {
  id: number;
  senderId: number;
  contactRoomId: number;
  message: string;
  createdAt: string;
  isRead?: boolean;
}

interface ReadStatus {
  id: number;
  contactRoomId: number;
  readerId: number;
  lastReadMessageId: number;
  updatedAt: string;
}

interface UserProfile {
  id: number;
  loginId: string;
  name: string;
  email: string;
  phoneNumber: string;
  profileImgUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ChatTestPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [readStatus, setReadStatus] = useState<ReadStatus | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const roomId = 2; // 테스트용 roomId

  // 메시지 조회
  const fetchMessages = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/chats/messages?roomId=${roomId}`);
      const data = await response.json();

      if (response.ok) {
        setMessages(data.messages || []);
        setReadStatus(data.readStatus);
        console.log('메시지 조회 성공:', data);

        // 메시지 조회 시 읽음 상태가 업데이트되었으므로 실시간 이벤트 발생
        console.log(
          '[메시지 조회] 읽음 상태 업데이트로 인한 실시간 이벤트 발생'
        );
      } else {
        setError(data.error || '메시지 조회 실패');
        console.error('메시지 조회 실패:', data);
      }
    } catch (err) {
      setError('네트워크 오류');
      console.error('메시지 조회 중 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  // 메시지 생성
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chats/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNewMessage('');
        // 새 메시지 추가 (올바른 형식으로)
        const newMessageObj = {
          id: data.message.id,
          senderId: data.message.senderId,
          contactRoomId: data.message.contactRoomId,
          message: data.message.message,
          createdAt: data.message.createdAt,
          isRead: true, // 내가 보낸 메시지는 읽음으로 처리
        };
        setMessages((prev) => [...prev, newMessageObj]);

        // 읽음 상태도 업데이트
        if (data.message.id) {
          setReadStatus((prev) =>
            prev
              ? {
                  ...prev,
                  lastReadMessageId: Math.max(
                    prev.lastReadMessageId,
                    data.message.id
                  ),
                }
              : null
          );
        }

        console.log('메시지 전송 성공:', data);
      } else {
        setError(data.error || '메시지 전송 실패');
        console.error('메시지 전송 실패:', data);
      }
    } catch (err) {
      setError('네트워크 오류');
      console.error('메시지 전송 중 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  // 실시간 구독 (메시지 + 읽음 상태)
  useEffect(() => {
    console.log('[실시간 구독] 채널 생성 시작, roomId:', roomId, 'user:', user);

    if (!user) {
      console.log('[실시간 구독] 사용자 정보가 없어서 구독을 건너뜀');
      return;
    }

    console.log('[실시간 구독] Supabase 클라이언트 상태 확인:', {
      hasRealtime: !!supabase.realtime,
    });

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
        (payload) => {
          console.log('[실시간 메시지] INSERT 이벤트 수신:', payload);
          console.log('[실시간 메시지] 새로운 메시지 감지, 화면에 바로 추가');
          console.log('[실시간 메시지] payload.new:', payload.new);
          console.log('[실시간 메시지] payload.old:', payload.old);
          console.log('[실시간 메시지] payload.eventType:', payload.eventType);
          console.log('[실시간 메시지] payload.table:', payload.table);

          // 새로운 메시지를 바로 화면에 추가
          if (payload.new) {
            const newMessage = {
              id: payload.new.id,
              senderId: payload.new.sender_id,
              contactRoomId: payload.new.contact_room_id,
              message: payload.new.message,
              createdAt: payload.new.created_at,
              isRead: false, // 상대방이 보낸 메시지는 안읽음으로 처리
            };

            console.log('[실시간 메시지] 새 메시지 객체 생성:', newMessage);

            setMessages((prev) => {
              console.log(
                '[실시간 메시지] 현재 메시지 목록:',
                prev.length,
                '개'
              );
              console.log(
                '[실시간 메시지] 기존 메시지 ID들:',
                prev.map((msg) => msg.id)
              );

              // 중복 방지 (이미 있는 메시지는 추가하지 않음)
              const exists = prev.some((msg) => msg.id === newMessage.id);
              if (exists) {
                console.log(
                  '[실시간 메시지] 이미 존재하는 메시지, 추가하지 않음:',
                  newMessage.id
                );
                return prev;
              }

              console.log('[실시간 메시지] 메시지 목록에 추가:', newMessage);
              const updatedMessages = [...prev, newMessage];
              console.log(
                '[실시간 메시지] 업데이트된 메시지 목록:',
                updatedMessages.length,
                '개'
              );

              // 로그 즉시 갱신
              console.log('🔄 실시간 메시지 수신 - 화면 갱신됨');
              console.log('📨 새 메시지:', newMessage.message);
              console.log('👤 발신자 ID:', newMessage.senderId);
              console.log('⏰ 수신 시간:', new Date().toLocaleTimeString());

              return updatedMessages;
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_messages',
          filter: `contact_room_id=eq.${roomId}`,
        },
        (payload) => {
          console.log('[실시간 메시지] 모든 이벤트 수신:', payload);
          console.log('[실시간 메시지] 이벤트 타입:', payload.eventType);
        }
      )
      .on('system', { event: 'disconnect' }, () => {
        console.log('[실시간 구독] 시스템 연결 해제됨');
      })
      .on('system', { event: 'reconnect' }, () => {
        console.log('[실시간 구독] 시스템 재연결됨');
      })
      .on('presence', { event: 'sync' }, () => {
        console.log('[실시간 구독] presence sync');
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('[실시간 구독] presence join:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('[실시간 구독] presence leave:', key, leftPresences);
      })

      .subscribe((status) => {
        console.log('[실시간 구독] 구독 상태:', status);
        if (status === 'SUBSCRIBED') {
          console.log(
            '[실시간 구독] 성공적으로 구독됨 - contact_messages 테이블의 INSERT 이벤트를 기다리는 중...'
          );
          console.log('[실시간 구독] 구독된 채널:', `chat_room_${roomId}`);
          console.log(
            '[실시간 구독] 필터 조건:',
            `contact_room_id=eq.${roomId}`
          );
        } else if (status === 'CHANNEL_ERROR') {
          console.error('[실시간 구독] 채널 오류 발생');
        } else if (status === 'TIMED_OUT') {
          console.error('[실시간 구독] 구독 시간 초과');
        }
      });

    return () => {
      console.log('[실시간 구독] 채널 정리:', `chat_room_${roomId}`);
      supabase.removeChannel(channel);
    };
  }, [roomId, user]);

  // 사용자 정보 조회
  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/users');

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/test/login');
          return;
        }
        throw new Error('사용자 정보를 가져올 수 없습니다.');
      }

      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : '사용자 정보 조회 중 오류가 발생했습니다.'
      );
      router.push('/test/login');
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 사용자 정보 및 메시지 로드
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // 사용자 정보가 로드된 후 메시지 조회
  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1
        style={{
          textAlign: 'center',
          marginBottom: '30px',
          fontSize: '28px',
          fontWeight: 'bold',
        }}
      >
        채팅 테스트 페이지
      </h1>

      {/* 로딩 상태 */}
      {isLoading && (
        <div
          style={{
            maxWidth: '400px',
            margin: '50px auto',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <p>로딩 중...</p>
        </div>
      )}

      {/* 로그인되지 않은 경우 */}
      {!isLoading && !user && (
        <div
          style={{
            maxWidth: '400px',
            margin: '50px auto',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <p>로그인이 필요합니다.</p>
          <button
            onClick={() => router.push('/test/login')}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            로그인 페이지로 이동
          </button>
        </div>
      )}

      {/* 로그인된 경우 채팅 인터페이스 */}
      {!isLoading && user && (
        <>
          {/* 상태 정보 */}
          <div
            style={{
              marginBottom: '20px',
              padding: '20px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              backgroundColor: '#f8f9fa',
            }}
          >
            <h2
              style={{
                marginBottom: '15px',
                fontSize: '18px',
                fontWeight: 'bold',
              }}
            >
              현재 상태
            </h2>
            <p>Room ID: {roomId}</p>
            <p>User ID: {user.id}</p>
            <p>User Name: {user.name}</p>
            <p>메시지 수: {messages.length}</p>
            {readStatus && (
              <p>마지막 읽은 메시지 ID: {readStatus.lastReadMessageId}</p>
            )}
            <p>실시간 메시지 구독: 🔄 활성화됨</p>
            <p>메시지 자동 갱신: ✅ 활성화됨</p>
            <p>실시간 구독: 🔄 활성화됨 (WebSocket 기반)</p>

            {/* 디버깅 버튼 */}
            <div style={{ marginTop: '15px' }}>
              <button
                onClick={() => {
                  console.log('[디버깅] 수동 메시지 새로고침');
                  fetchMessages();
                }}
                style={{
                  marginRight: '10px',
                  padding: '8px 16px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                메시지 새로고침
              </button>
              <button
                onClick={() => {
                  console.log('[디버깅] Supabase 연결 상태 확인');
                  console.log('Realtime 상태:', supabase.realtime);
                  console.log('Supabase 클라이언트:', supabase);
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#17a2b8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                연결 상태 확인
              </button>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div
              style={{
                backgroundColor: '#ffebee',
                color: '#c62828',
                padding: '10px',
                borderRadius: '4px',
                marginBottom: '20px',
              }}
            >
              {error}
            </div>
          )}

          {/* 메시지 목록 */}
          <div
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px',
              height: '400px',
              overflowY: 'auto',
              backgroundColor: 'white',
            }}
          >
            <h2
              style={{
                marginBottom: '15px',
                fontSize: '18px',
                fontWeight: 'bold',
              }}
            >
              메시지 목록
            </h2>
            {loading && <p style={{ color: '#666' }}>로딩 중...</p>}
            {messages.length === 0 && !loading && (
              <p style={{ color: '#666' }}>메시지가 없습니다.</p>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  marginBottom: '15px',
                  padding: '15px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #dee2e6',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <span style={{ fontWeight: 'bold' }}>
                        User {message.senderId}
                      </span>
                    </div>
                    <p style={{ marginTop: '5px' }}>{message.message}</p>
                  </div>
                  <span
                    style={{
                      fontSize: '12px',
                      color: '#666',
                      marginLeft: '10px',
                    }}
                  >
                    {new Date(message.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 메시지 입력 */}
          <div
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: 'white',
            }}
          >
            <h2
              style={{
                marginBottom: '15px',
                fontSize: '18px',
                fontWeight: 'bold',
              }}
            >
              메시지 전송
            </h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type='text'
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder='메시지를 입력하세요...'
                style={{
                  flex: 1,
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  outline: 'none',
                }}
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !newMessage.trim()}
                style={{
                  padding: '10px 20px',
                  backgroundColor:
                    loading || !newMessage.trim() ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor:
                    loading || !newMessage.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? '전송 중...' : '전송'}
              </button>
            </div>
          </div>

          {/* 자동 refetch 상태 표시 */}
          <div
            style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#e8f5e8',
              borderRadius: '8px',
              border: '1px solid #28a745',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                margin: '0',
                color: '#28a745',
                fontWeight: 'bold',
                fontSize: '14px',
              }}
            >
              🔄 실시간 업데이트 활성화됨
            </p>
            <p
              style={{
                margin: '5px 0 0 0',
                color: '#666',
                fontSize: '12px',
              }}
            >
              메시지와 읽음 상태가 실시간으로 자동 갱신됩니다
            </p>
          </div>
        </>
      )}
    </div>
  );
}
