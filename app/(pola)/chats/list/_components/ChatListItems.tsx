import Link from 'next/link';
import styles from './ChatListItems.module.css';

interface ChatRoom {
  chatRoomId: number;
  seniorNickname: string;
}

interface ChatListItemsProps {
  chatRooms: ChatRoom[];
}

export default function ChatListItems({ chatRooms }: ChatListItemsProps) {
  return (
    <ul className={styles.chatList}>
      {chatRooms.length === 0 ? (
        <li className={styles.emptyState}>채팅방이 없습니다.</li>
      ) : (
        chatRooms.map((room) => (
          <li key={room.chatRoomId}>
              <Link href={`/chats/${room.chatRoomId}`} className={styles.chatItem}>
              <div className={styles.avatar}></div>
              <div className={styles.info}>
                <div className={styles.name}>{room.seniorNickname} 시니어</div>
                <div className={styles.tags}>
                  <span className={styles.tag}>방청소</span>
                  <span className={styles.tag}>헬쓰기</span>
                </div>
              </div>
              <span className={styles.unread}>9</span>
          </Link>
            </li>
        ))
      )}
    </ul>
  );
} 