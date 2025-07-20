import styles from './ChatListTopBar.module.css';

export default function ChatListTopBar() {
  return (
    <div className={styles.topBar}>
      <span className={styles.edit}>수정하기</span>
      <span className={styles.title}>채팅내역</span>
    </div>
  );
} 