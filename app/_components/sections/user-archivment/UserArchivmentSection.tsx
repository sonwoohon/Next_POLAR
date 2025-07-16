"use client";
import Link from "next/link";
import styles from "./userArchivment.module.css";
import BadgeItem from "../../../(pola)/user/profile/[nickname]/_components/BadgeItem";

interface UserArchivmentSectionProps {
  nickname: string;
  title: string;
  badges: Array<{
    id: number;
    icon: string;
    tooltip: string;
  }>;
}

const UserArchivmentSection: React.FC<UserArchivmentSectionProps> = ({
  nickname,
  title,
  badges,
}) => {
  const moreLink = `/user/profile/${nickname}/archivment`;

  return (
    <section className={styles.userArchiveSection}>
      <div className={styles.userArchiveSectionTitleContainer}>
        <h2>{title}</h2>
        <div className={styles.userArchiveSectionTitleButton}>
          <Link href={moreLink}>더보기</Link>
        </div>
      </div>
      <div className={styles.userArchiveBadgeGrid}>
        {badges.map((badge, idx) => (
          <BadgeItem
            key={badge.id}
            icon={badge.icon}
            tooltip={badge.tooltip}
            isFirst={idx === 0}
            isLast={idx === badges.length - 1}
          />
        ))}
      </div>
    </section>
  );
};

export default UserArchivmentSection;
