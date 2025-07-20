import Link from 'next/link';
import Image from 'next/image';
import styles from './ChatListItems.module.css';
import { ChatRoomWithDetails } from '@/lib/api_front/chat.api';
import { getCategoryName } from '@/lib/utils/categoryUtils';
import DummyUser from '@/public/images/dummies/dummy_user.png';

interface ChatListItemsProps {
  chatRooms: ChatRoomWithDetails[];
}

export default function ChatListItems({ chatRooms }: ChatListItemsProps) {
  return (
    <ul className={styles.chatList}>
      {chatRooms.length === 0 ? (
        <li className={styles.emptyState}>채팅방이 없습니다.</li>
      ) : (
        chatRooms.map((room) => (
          <Link href={`/chats/${room.chatRoomId}`} key={room.chatRoomId}>
            <li className={styles.chatItem}>
              <div className={styles.avatar}>
                <Image
                  src={room.opponentProfile.profileImgUrl || DummyUser}
                  alt='Profile'
                  width={48}
                  height={48}
                  className={styles.profileImage}
                />
              </div>
              <div className={styles.info}>
                <div className={styles.name}>{room.opponentProfile.name}</div>
                <div className={styles.tags}>
                  {room.latestHelp?.category &&
                  room.latestHelp.category.length > 0 ? (
                    room.latestHelp.category.map((cat, index) => (
                      <span key={index} className={styles.tag}>
                        {getCategoryName(cat.id)}
                      </span>
                    ))
                  ) : (
                    <span className={styles.tag}>기타</span>
                  )}
                </div>
              </div>
              {/* <span className={styles.unread}>9</span> */}
            </li>
          </Link>
        ))
      )}
    </ul>
  );
}
