"use client";
import Link from "next/link";
import styles from "./userArchivment.module.css";

interface UserArchivmentSectionProps {
  title?: string;
  moreLink?: string;
  badges?: Array<{
    id: number;
    icon: string;
    tooltip: string;
  }>;
}

const UserArchivmentSection: React.FC<UserArchivmentSectionProps> = ({
  title = "유저 업적",
  moreLink = "/user/profile/achievement",
  badges = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    icon: "🧹",
    tooltip: "청소마스터",
  })),
}) => {
  return (
    <section className={styles.userArchiveSection}>
      <div className={styles.userArchiveSectionTitleContainer}>
        <h2>{title}</h2>
        <div className={styles.userArchiveSectionTitleButton}>
          <Link href={moreLink}>더보기</Link>
        </div>
      </div>
      <div className={styles.userArchiveBadgeGrid}>
        {badges.map((badge) => (
          <div className={styles.userArchiveBadgeItem} key={badge.id}>
            {badge.icon}
            <div className={styles.userArchiveBadgeTooltip}>
              {badge.tooltip}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UserArchivmentSection;
