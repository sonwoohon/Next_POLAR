'use client';
import { useParams } from 'next/navigation';
import { useHelpApplicants, useAcceptHelpApplicant } from '@/lib/hooks/help';
import ApplicantItem from './ApplicantItem';
import styles from './ApplicantsList.module.css';

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
