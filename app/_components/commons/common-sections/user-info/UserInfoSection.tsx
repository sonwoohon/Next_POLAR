'use client';
import Image from 'next/image';
import RatingStar from '@/public/images/icons/icon_star.svg';
import styles from './UserInfoSection.module.css';
import { UserProfileResponseDto } from '@/backend/users/user/applications/dtos/UserDtos';
import { useUserReviewStats } from '@/lib/hooks/review/useUserReviewStats';

interface UserInfoSectionProps {
  data: UserProfileResponseDto;
}

const UserInfoSection: React.FC<UserInfoSectionProps> = ({ data }) => {
  const { nickname, name, profileImgUrl, userRole } = data;

  // 실제 리뷰 평점 데이터 가져오기
  const { data: reviewStats } = useUserReviewStats(nickname);
  const rating = reviewStats?.averageRating || 0;

  return (
    <section className={styles.userInfoSection}>
      <div className={styles.userProfileImageContainer}>
        <div
          className={styles.userProfileImage}
          style={
            profileImgUrl ? { backgroundImage: `url(${profileImgUrl})` } : {}
          }
        />
        {/* archive_badge 필드는 UserProfileResponseDto에 없으므로 주석 처리 또는 제거 */}
        {/* <div className={styles.userArchiveBadge}>{archive_badge}</div> */}
      </div>

      <div className={styles.userInfo}>
        {/* 유저 평점 */}
        <div className={styles.userRating}>
          <div className={styles.userRatingStar}>
            <Image src={RatingStar} alt='ratingStar' />
          </div>
          <span>{rating.toFixed(1)}</span>
        </div>

        {/* 유저 이름 */}
        <div className={styles.userNameContainer}>
          <span>{name} 님</span>
          <div className={styles.userTypeBadge}>
            {userRole === 'senior' ? 'Sr.' : 'Jr.'}
          </div>
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
