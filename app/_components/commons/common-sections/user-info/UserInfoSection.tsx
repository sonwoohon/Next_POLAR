"use client";
import Image from "next/image";
import RatingStar from "@/public/images/icons/icon_star.svg";
import styles from "./UserInfoSection.module.css";

interface UserInfoSectionProps {
  nickname: string;
  userName?: string;
  userType?: "Jr." | "Sr.";
  rating?: number;
  archiveBadge?: string;
  profileImageUrl?: string;
}

const UserInfoSection: React.FC<UserInfoSectionProps> = ({
  nickname,
  userName = "사나이",
  userType = "Jr.",
  rating = 4.5,
  archiveBadge = "환경미화원",
  profileImageUrl,
}) => {
  return (
    <section className={styles.userInfoSection}>
      <div className={styles.userProfileImageContainer}>
        <div
          className={styles.userProfileImage}
          style={
            profileImageUrl
              ? { backgroundImage: `url(${profileImageUrl})` }
              : {}
          }
        />
        <div className={styles.userArchiveBadge}>{archiveBadge}</div>
      </div>

      <div className={styles.userInfo}>
        {/* 유저 평점 */}
        <div className={styles.userRating}>
          <div className={styles.userRatingStar}>
            <Image src={RatingStar} alt="ratingStar" />
          </div>
          <span>{rating}</span>
        </div>

        {/* 유저 이름 */}
        <div className={styles.userNameContainer}>
          <span>{userName} 님</span>
          <div className={styles.userTypeBadge}>{userType}</div>
        </div>

        {/* 유저 닉네임 */}
        <div className={styles.userNicknameContainer}>
          <span>({nickname})</span>
        </div>
      </div>
    </section>
  );
};

export default UserInfoSection;
