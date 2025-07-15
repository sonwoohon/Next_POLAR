"use client";
import styles from "./_styles/userProfile.module.css";
import Image from "next/image";
import RatingStar from "@/public/images/icons/icon_star.svg";
import { useParams } from "next/navigation";
import Link from "next/link";

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

      {/* 유저 티어 */}
      {/* TODO: 컴포넌트 분리 */}
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
          {/* 프로그레스바 */}
          <div className={styles.userTierProgressBarWrapper}>
            <div className={styles.userTierProgressInfo}>
              <span>
                다음 티어까지 <b>35,000</b>점
              </span>
            </div>
            <div className={styles.userTierProgressBarBg}>
              <div
                className={styles.userTierProgressBarFill}
                style={{ width: "95%" }} // 예시: 765,000/800,000
              ></div>
            </div>
            <div className={styles.userTierProgressBarScore}>
              765,000 <span>/800,000</span>
            </div>
          </div>
        </div>
      </section>

      {/* 칭호 뱃지  */}
      <section className={styles.userArchiveSection}>
        <div className={styles.userArchiveSectionTitleContainer}>
          <h2>유저 업적</h2>
          <div className={styles.userArchiveSectionTitleButton}>
            <Link href="/user/profile/achievement">더보기</Link>
          </div>
        </div>
        <div className={styles.userArchiveBadgeGrid}>
          {Array.from({ length: 16 }).map((_, i) => (
            <div className={styles.userArchiveBadgeItem} key={i}>
              🧹
              <div className={styles.userArchiveBadgeTooltip}>청소마스터</div>
            </div>
          ))}
        </div>
      </section>

      {/* 헬프 기록 */}
      <section className={styles.userHelpsSection}>
        <div className={styles.userHelpsTitleContainer}>
          <h2>헬프 기록</h2>
          <div className={styles.userArchiveSectionTitleButton}>
            <Link href="/user/profile/achievement">더보기</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserProfilePage;
