'use client';
import { useEffect, useRef } from 'react';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import { useAuthStore } from '../stores/authStore';
import { getHelpParticipants } from '../api_front/help.api';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface UseVerificationRealtimeProps {
  onVerificationReceived?: (helpId: number, helpTitle: string) => void;
  onHelpCompleted?: (
    helpId: number,
    helpTitle: string,
    userRole: 'senior' | 'junior'
  ) => void;
  onLoadingChange?: (isLoading: boolean) => void;
}

export function useVerificationRealtime({
  onVerificationReceived,
  onHelpCompleted,
  onLoadingChange,
}: UseVerificationRealtimeProps) {
  const userNickname = useAuthStore((state) => state.user?.nickname);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!userNickname) {
      return;
    }

    // 인증번호 실시간 구독
    const channel = supabase
      .channel('verification_codes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'help_verification_codes',
        },
        async (payload) => {
          try {
            onLoadingChange?.(true);

            // API를 통해 Help 참여자 정보 조회
            const helpParticipants = await getHelpParticipants(
              payload.new.help_id
            );

            if (helpParticipants.isJunior) {
              onVerificationReceived?.(
                helpParticipants.helpId,
                helpParticipants.helpTitle
              );
            }
          } catch (error) {
            console.error('❌ 인증번호 처리 중 오류:', error);
          } finally {
            onLoadingChange?.(false);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'help_verification_codes',
        },
        async (payload) => {
          try {
            console.log('🔄 DELETE 이벤트 수신:', payload);
            onLoadingChange?.(true);

            const helpId = payload.old.help_id;
            const helpParticipants = await getHelpParticipants(helpId);
            console.log('👥 Help 참여자 정보:', helpParticipants);

            // 주니어가 인증번호를 입력했을 때만 완료 처리
            if (helpParticipants.isJunior) {
              console.log('👨‍🎓 주니어 완료 처리');
              // 주니어에게는 완료 상태 표시
              onHelpCompleted?.(helpId, helpParticipants.helpTitle, 'junior');
            } else if (helpParticipants.isSenior) {
              console.log('👴 시니어 완료 알림');
              // 시니어에게는 주니어가 인증번호를 입력했다는 알림
              onHelpCompleted?.(helpId, helpParticipants.helpTitle, 'senior');
            }
          } catch (error) {
            console.error('❌ Help 완료 처리 중 오류:', error);
          } finally {
            onLoadingChange?.(false);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          console.error('❌ 인증번호 실시간 연결 오류');
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [userNickname, onVerificationReceived, onHelpCompleted, onLoadingChange]);

  return {
    isConnected: !!channelRef.current,
  };
}
