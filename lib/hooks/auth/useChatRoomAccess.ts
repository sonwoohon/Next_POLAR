import { useQuery } from '@tanstack/react-query';
import { checkChatRoomAccess, ChatRoomAccessResponse } from '../../api_front/chat.api';

interface UseChatRoomAccessProps {
  nickname: string;
  chatRoomId: number;
}

export const useChatRoomAccess = ({ nickname, chatRoomId }: UseChatRoomAccessProps) => {
  return useQuery<ChatRoomAccessResponse>({
    queryKey: ['chat-room-access', nickname, chatRoomId],
    queryFn: () => checkChatRoomAccess(nickname, chatRoomId),
    enabled: !!nickname && !!chatRoomId,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    retry: 1, // 실패 시 1번만 재시도
  });
}; 