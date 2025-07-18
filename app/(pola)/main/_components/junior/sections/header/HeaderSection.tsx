import styles from './HeaderSection.module.css';

export default function HeaderSection() {
  return (
    <header className={styles.header}>
      <span className={styles.back}>{'<'} </span>
      <span className={styles.menu}>☰</span>
    </header>
  );
} 