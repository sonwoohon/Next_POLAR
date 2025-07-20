'use client';

import { useChatRooms } from '@/lib/hooks';
import styles from './ChatList.module.css';
import ChatListTopBar from './_components/ChatListTopBar';
import ChatListSearch from './_components/ChatListSearch';
import ChatListItems from './_components/ChatListItems';

export default function JuniorChatListPage() {
  const { data: chatRoomsData, isLoading, error } = useChatRooms();

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>채팅방 목록을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          채팅방 목록을 불러오는데 실패했습니다.
        </div>
      </div>
    );
  }

  const chatRooms = chatRoomsData?.rooms || [];
  return (
    <div className={styles.container}>
      <ChatListTopBar />
      <ChatListSearch />
      <ChatListItems chatRooms={chatRooms} />
    </div>
  );
}
