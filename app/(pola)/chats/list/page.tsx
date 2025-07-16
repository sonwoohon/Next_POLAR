import styles from './ChatList.module.css';

export default function JuniorChatListPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.logo}>POLAR</span>
        <span className={styles.spacer}></span>
        <span className={styles.bell}>🔔</span>
      </header>
      <div className={styles.topBar}>
        <span className={styles.edit}>수정하기</span>
        <span className={styles.title}>채팅내역</span>
      </div>
      <div className={styles.searchBox}>
        <span className={styles.searchIcon}>🔍</span>
        <input className={styles.searchInput} placeholder='Search' />
      </div>
      <ul className={styles.chatList}>
        {[1, 2].map((item) => (
          <li className={styles.chatItem} key={item}>
            <div className={styles.avatar}></div>
            <div className={styles.info}>
              <div className={styles.name}>무슨무슨 시니어</div>
              <div className={styles.tags}>
                <span className={styles.tag}>방청소</span>
                <span className={styles.tag}>헬쓰기</span>
              </div>
            </div>
            <span className={styles.unread}>9</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
