import styles from './HelpStats.module.css';

interface HelpStatsProps {
  totalHelps: number;
  openHelps: number;
  connectingHelps: number;
}

export default function HelpStats({ totalHelps, openHelps, connectingHelps }: HelpStatsProps) {
  return (
    <div className={styles.statsContainer}>
      <div className={styles.statItem}>
        <span className={styles.statLabel}>전체:</span>
        <span className={styles.statValue}>{totalHelps}개</span>
      </div>
      <div className={styles.statItem}>
        <span className={styles.statLabel}>대기중:</span>
        <span className={styles.statValue}>{openHelps}개</span>
      </div>
      <div className={styles.statItem}>
        <span className={styles.statLabel}>진행중:</span>
        <span className={styles.statValue}>{connectingHelps}개</span>
      </div>
    </div>
  );
} 