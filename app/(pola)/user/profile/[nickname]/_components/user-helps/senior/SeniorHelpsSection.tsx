'use client';
import Link from 'next/link';
import styles from './seniorHelps.module.css';
import HelpListCard from '@/app/_components/commons/list-card/help-list-card/HelpListCard';
import { useSeniorHelps } from '@/lib/hooks/help';
import { ROUTES } from '@/lib/constants/routes';

interface SeniorHelpsSectionProps {
  title?: string;
  nickname: string;
}

const SeniorHelpsSection: React.FC<SeniorHelpsSectionProps> = ({
  title,
  nickname,
}) => {
  const { data: seniorHelpsData, isLoading, error } = useSeniorHelps();

  if (isLoading) {
    return (
      <section className={styles.seniorHelpsSection}>
        <div className={styles.seniorHelpsTitleContainer}>
          <h2>{title}</h2>
        </div>
        <div className={styles.seniorHelpList}>
          <div>로딩 중...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.seniorHelpsSection}>
        <div className={styles.seniorHelpsTitleContainer}>
          <h2>{title}</h2>
        </div>
        <div className={styles.seniorHelpList}>
          <div>데이터를 불러오는 중 오류가 발생했습니다.</div>
        </div>
      </section>
    );
  }

  const helps = seniorHelpsData?.data || [];

  return (
    <section className={styles.seniorHelpsSection}>
      <div className={styles.seniorHelpsTitleContainer}>
        <h2>{title}</h2>
        <div className={styles.seniorHelpsSectionTitleButton}>
          <Link href={ROUTES.USER_PROFILE(nickname) + '/helps'}>더보기</Link>
        </div>
      </div>

      <div className={styles.seniorHelpList}>
        {helps.length > 0 ? (
          helps.map((help) => <HelpListCard key={help.id} help={help} />)
        ) : (
          <div>등록된 도움 요청이 없습니다.</div>
        )}
      </div>
    </section>
  );
};

export default SeniorHelpsSection;
