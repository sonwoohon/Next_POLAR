"use client";
import { useParams } from "next/navigation";
import { useHelpApplicants, useAcceptHelpApplicant } from "@/lib/hooks/help";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import UserInfoSection from "@/app/_components/commons/common-sections/user-info/UserInfoSection";
import { UserProfileResponseDto } from "@/backend/users/user/applications/dtos/UserDtos";
import styles from "./ApplicantsList.module.css";

export default function ApplicantsPage() {
  const params = useParams();
  const helpId = Number(params.helpId);

  const {
    data: applicantsData,
    isLoading: isLoadingApplicants,
    error: applicantsError,
  } = useHelpApplicants(helpId);
  const { mutate: acceptApplicant, isPending: isAccepting } =
    useAcceptHelpApplicant();

  if (isLoadingApplicants) {
    return <div className={styles.loading}>지원자 목록을 불러오는 중...</div>;
  }

  if (applicantsError) {
    return (
      <div className={styles.error}>지원자 목록을 불러오는데 실패했습니다.</div>
    );
  }

  if (!applicantsData?.applicants || applicantsData.applicants.length === 0) {
    return <div className={styles.empty}>아직 지원자가 없습니다.</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>지원자 목록</h1>
      <div className={styles.applicantsList}>
        {applicantsData.applicants.map((applicant) => (
          <ApplicantItem
            key={applicant.id}
            applicant={applicant}
            onAccept={acceptApplicant}
            isAccepting={isAccepting}
          />
        ))}
      </div>
    </div>
  );
}

interface ApplicantItemProps {
  applicant: {
    id: number;
    helpId: number;
    juniorNickname: string;
    isAccepted: boolean;
    appliedAt: string;
  };
  onAccept: (params: { helpId: number; juniorNickname: string }) => void;
  isAccepting: boolean;
}

function ApplicantItem({
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
    userRole: "junior", // 지원자는 모두 junior
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
          상태: {applicant.isAccepted ? "수락됨" : "대기중"}
        </div>
        <div className={styles.appliedAt}>
          지원일: {new Date(applicant.appliedAt).toLocaleDateString("ko-KR")}
        </div>
        <button
          className={`${styles.acceptButton} ${
            applicant.isAccepted ? styles.acceptedButton : ""
          }`}
          onClick={handleAccept}
          disabled={isAccepting || applicant.isAccepted}
        >
          {applicant.isAccepted
            ? "수락됨"
            : isAccepting
            ? "수락 중..."
            : "수락하기"}
        </button>
      </div>
    </div>
  );
}
