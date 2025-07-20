import styles from "./HelpContent.module.css";
import { HelpDetailResponseDto } from "@/backend/helps/applications/dtos/HelpDTO";
import { useHelpApplicants } from "@/lib/hooks/help/useHelpApplicants";
import { getCategoryName } from "@/lib/utils/categoryUtils";

interface HelpContentProps {
  help: HelpDetailResponseDto | null;
}

export default function HelpContent({ help }: HelpContentProps) {
  const { data: applicantsData, isLoading: isLoadingApplicants } =
    useHelpApplicants(help?.id || 0);
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!help) return null;

  return (
    <div className={styles.mainContent}>
      <div className={styles.titleAndStatus}>
        <h1 className={styles.helpTitle}>{help.title}</h1>
        <div className={styles.helpStatus}>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>상태</span>
            <span className={styles.statusValue}>{help.status}</span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>지원자</span>
            <span className={styles.statusValue}>
              {isLoadingApplicants
                ? "로딩중..."
                : `${applicantsData?.applicants?.length || 0}명`}
            </span>
          </div>
        </div>
      </div>

      {/* Help Categories */}
      {help.category && help.category.length > 0 && (
        <div className={styles.helpCategories}>
          {help.category.map((cat, index) => (
            <span key={index} className={styles.categoryTag}>
              {getCategoryName(cat.id)}
            </span>
          ))}
        </div>
      )}

      {/* Help Period */}
      <div className={styles.helpPeriod}>
        {`${formatDate(new Date(help.startDate))} ~ ${formatDate(
          new Date(help.endDate)
        )}`}
      </div>

      {/* Help Content */}
      <div className={styles.helpContent}>{help.content}</div>
    </div>
  );
}
