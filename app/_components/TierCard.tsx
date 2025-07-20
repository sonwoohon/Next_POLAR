import styles from "./TierCard.module.css";
// import sliverTierImg from '../assets/sliverTier.webp';
// import Image from "next/image";

export default function TierCard() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        {/* <Image
          className={styles.emblem}
          src={sliverTierImg}
          alt='실버 엠블럼'
        /> */}
        <div className={styles.tierInfo}>
          <div className={styles.percent}>상위 10%</div>
          <div className={styles.tierName}>SILVER</div>
        </div>
      </div>
      <div className={styles.nextScore}>
        다음 티어까지 <strong>35,000점</strong>
      </div>
      <div className={styles.progressBar}>
        <div className={styles.progress} style={{ width: "95.6%" }} />
      </div>
      <div className={styles.scoreText}>765,000 / 800,000</div>
    </div>
  );
}
