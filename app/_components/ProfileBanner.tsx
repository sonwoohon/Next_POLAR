import styles from './ProfileBanner.module.css';
import sliverTierImg from '@/public/images/sliverTier.webp';
import defaultImg from '@/public/images/dongHyun.jpg';
import Image from 'next/image';

export default function ProfileBanner() {
  return (
    <div className={styles.card}>
      <div className={styles.ribbon}>
        <div className={styles.ribbonRect}></div>
        <div className={styles.ribbonTri}></div>
        <Image
          className={styles.ribbonEmblem}
          src={defaultImg}
          alt='플레티넘 엠블럼'
        />
      </div>
      <div className={styles.content}>
        <div className={styles.greeting}>
          000 용사님, <br />
          사람들을 구해주세요!
        </div>
        <div className={styles.iconBox}>
          <img
            className={styles.icon}
            src='https://via.placeholder.com/24/0000FF?text=🏠'
            alt='아이콘'
          />
        </div>
        <div className={styles.bigEmblem}>
          <Image src={sliverTierImg} alt='플레티넘' width={160} height={160} />
        </div>
      </div>
      <div className={styles.progressBar}>
        <div className={styles.progress} style={{ width: '95.6%' }} />
      </div>
      <div className={styles.scoreTextWrap}>
        <div className={styles.nextScore}>
          다음 티어까지 <strong>35,000점</strong>
        </div>
        <div className={styles.scoreText}>765,000 / 800,000</div>
      </div>
    </div>
  );
}
