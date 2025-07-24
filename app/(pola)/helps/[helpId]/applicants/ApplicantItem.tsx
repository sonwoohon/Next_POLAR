'use client';
import { useUserProfile } from '@/lib/hooks';
import UserInfoSection from '@/app/_components/commons/common-sections/user-info/UserInfoSection';
import { UserProfileResponseDto } from '@/backend/users/user/applications/dtos/UserDtos';
import { ApplicantItemProps } from './types';
import styles from './ApplicantsList.module.css';

export default function ApplicantItem({
  applicant,
  onAccept,
  isAccepting,
}: ApplicantItemProps) {
  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile(
    applicant.juniorNickname
  );

  if (isLoadingProfile) {
    return (
      <div className={styles.loadingItem}>프로필 정보를 불러오는 중...</div>
    );
  }

  if (!userProfile) {
    return (
      <div className={styles.errorItem}>프로필 정보를 불러올 수 없습니다.</div>
    );
  }

  // UserProfile을 UserProfileResponseDto로 변환
  const userProfileDto: UserProfileResponseDto = {
    nickname: userProfile.data.nickname,
    name: userProfile.data.name,
    profileImgUrl: userProfile.data.profileImgUrl,
    address: userProfile.data.address,
    userRole: 'junior', // 지원자는 모두 junior
  };

  const handleAccept = () => {
    onAccept({
      helpId: applicant.helpId,
      juniorNickname: applicant.juniorNickname,
    });
  };

  return (
    <div className={styles.applicantItem}>
      <UserInfoSection data={userProfileDto} />
      <div className={styles.applicantInfo}>
        <div
          className={`${styles.status} ${
            applicant.isAccepted ? styles.accepted : styles.pending
          }`}
        >
          상태: {applicant.isAccepted ? '수락됨' : '대기중'}
        </div>
        <div className={styles.appliedAt}>
          지원일: {new Date(applicant.appliedAt).toLocaleDateString('ko-KR')}
        </div>
        <button
          className={`${styles.acceptButton} ${
            applicant.isAccepted ? styles.acceptedButton : ''
          }`}
          onClick={handleAccept}
          disabled={isAccepting || applicant.isAccepted}
        >
          {applicant.isAccepted
            ? '수락됨'
            : isAccepting
            ? '수락 중...'
            : '수락하기'}
        </button>
      </div>
    </div>
  );
}
