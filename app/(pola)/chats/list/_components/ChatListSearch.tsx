import styles from './ChatListSearch.module.css';

export default function ChatListSearch() {
  return (
    <div className={styles.searchBox}>
      <span className={styles.searchIcon}>🔍</span>
      <input className={styles.searchInput} placeholder='Search' />
    </div>
  );
} 