import styles from './ProfileCard.module.css';
import defaultImg from '@/public/images/dongHyun.jpg';
import Image from 'next/image';


export default function ProfileCard() {
  return (
    <div className={styles.card}>
      <div className={styles.avatarWrapper}>
        <div className={styles.avatar}>
          <Image src={defaultImg} alt='프로필' />
        </div>
        <div className={styles.roleBadge}>
          <div className={styles.iconCircle}>
            <img
              className={styles.roleIcon}
              src='https://via.placeholder.com/16/000000?text=🧹'
              alt='아이콘'
            />
          </div>
          <span className={styles.roleText}>환경미화원</span>
        </div>
      </div>
      <div className={styles.info}>
        <div className={styles.rating}>
          <span className={styles.star}>★</span>
          <span className={styles.score}>5.0</span>
        </div>
        <div className={styles.name}>
          사나이 님 <span className={styles.jrBadge}>Jr.</span>
        </div>
        <div className={styles.tagline}>
          덕분에 오늘도 세상이 한층 더 따뜻해졌어요.
        </div>
      </div>
    </div>
  );
}
