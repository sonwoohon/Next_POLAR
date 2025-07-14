"use client";
import styles from "./_styles/userProfile.module.css";
import Image from "next/image";
import RatingStar from "@/public/images/icons/icon_star.svg";
import { useParams } from "next/navigation";

const UserProfilePage: React.FC = () => {
  const params = useParams();
  const nickname = decodeURIComponent(params.nickname as string);

  return (
    <div className={styles.container}>
      <h1>유저프로필</h1>
      <section className={styles.userInfoSection}>
        <div className={styles.userProfileImageContainer}>
          <div className={styles.userProfileImage} />
          <div className={styles.userArchiveBadge}>환경미화원</div>
        </div>

        <div className={styles.userInfo}>
          {/* 유저 평점 */}
          <div className={styles.userRating}>
            <div className={styles.userRatingStar}>
              <Image src={RatingStar} alt="ratingStar" />
            </div>
            <span>4.5</span>
          </div>

          {/* 유저 이름 */}
          <div className={styles.userNameContainer}>
            <span>{"사나이"} 님</span>
            <div className={styles.userTypeBadge}>Jr.</div>
          </div>

          {/* 유저 닉네임 */}
          <div className={styles.userNicknameContainer}>
            <span>({nickname})</span>
          </div>
        </div>
      </section>

      <section className={styles.userTierSection}>
        <h2>티어</h2>
        <div className={styles.userTierContainer}>
          <div className={styles.userTierInfo}>
            <div className={styles.userTierImage}></div>
            <div className={styles.userTierInfoTextContainer}>
              <span className={styles.userTierSeason}>2025 - 1시즌</span>
              <span className={styles.userTierName}>SILVER</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserProfilePage;
