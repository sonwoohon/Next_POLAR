"use client";
import styles from "./userTier.module.css";

interface UserTierSectionProps {
  season?: string;
  tierName?: string;
  currentScore?: number;
  maxScore?: number;
  nextTierScore?: number;
  progressPercentage?: number;
}

const UserTierSection: React.FC<UserTierSectionProps> = ({
  season = "2025 - 1시즌",
  tierName = "SILVER",
  currentScore = 765000,
  maxScore = 800000,
  nextTierScore = 35000,
  progressPercentage = 95,
}) => {
  return (
    <section className={styles.userTierSection}>
      <h2>티어</h2>
      <div className={styles.userTierContainer}>
        <div className={styles.userTierInfo}>
          <div className={styles.userTierImage}></div>
          <div className={styles.userTierInfoTextContainer}>
            <span className={styles.userTierSeason}>{season}</span>
            <span className={styles.userTierName}>{tierName}</span>
          </div>
        </div>
        {/* 프로그레스바 */}
        <div className={styles.userTierProgressBarWrapper}>
          <div className={styles.userTierProgressInfo}>
            <span>
              다음 티어까지 <b>{nextTierScore.toLocaleString()}</b>점
            </span>
          </div>
          <div className={styles.userTierProgressBarBg}>
            <div
              className={styles.userTierProgressBarFill}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className={styles.userTierProgressBarScore}>
            {currentScore.toLocaleString()}{" "}
            <span>/{maxScore.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserTierSection;
