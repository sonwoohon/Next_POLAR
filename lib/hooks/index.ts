// 기존 훅들
export { useApiQuery, useApiMutation } from './useApi';
export { useCreateHelp } from './help/useCreateHelp';
export { useHelpDetail } from './help/useHelpDetail';
export { useLogin } from './useLogin';
export { useAuthStore } from '../stores/authStore';

// 온보딩 관련 훅들
export { useOnboardingAuth } from './onboarding/useOnboardingAuth';
export { useOnboardingData } from './onboarding/useOnboardingData';

// 헤더 관련 훅들
export { useHeaderScroll } from './header/useHeaderScroll';

// 푸터 관련 훅들
export { useFooterNavigation } from './footer/useFooterNavigation';

// 네비게이션 관련 훅들
export { useNavigation } from './useNavigation';

// 채팅 관련 훅들
export { useChatRooms } from './chats/useChatRooms';
export { useChatMessages } from './chats/useChatMessages';
export { useSendMessage } from './chats/useSendMessage';
export { useRealtimeChat } from './chats/useRealtimeChat';
export { useChatInput } from './chats/useChatInput';
export { useChatRoomDetailWithHelps } from './chats/useChatRoomDetailWithHelps';
