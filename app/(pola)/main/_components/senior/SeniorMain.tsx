'use client';
import { useRouter } from 'next/navigation';
import styles from './SeniorMain.module.css';
import { useSeniorHelps } from '@/lib/hooks/help/useSeniorHelps';
import HelpListCard from '@/app/_components/commons/list-card/help-list-card/HelpListCard';

export default function SeniorMainPage() {
  const router = useRouter();
  const { data: seniorHelpsData, isLoading, error } = useSeniorHelps();

  const handleQuickStart = () => {
    router.push('/helps/create');
  };

  return (
    <div className={styles.container}>
      <div className={styles.buttonRow}>
        <button className={styles.button} onClick={handleQuickStart}>
          빠른 시작 !
        </button>
      </div>

      {/* 내가 작성한 헬프 리스트 */}
      <div className={styles.myHelpsSection}>
        <h2 className={styles.sectionTitle}>내가 작성한 헬프</h2>
        {isLoading && <div className={styles.loading}>로딩 중...</div>}
        {error && (
          <div className={styles.error}>
            헬프 리스트를 불러오는데 실패했습니다.
          </div>
        )}
        {seniorHelpsData?.data && seniorHelpsData.data.length > 0 ? (
          <div className={styles.helpList}>
            {seniorHelpsData.data.map((help) => (
              <HelpListCard key={help.id} help={help} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            아직 작성한 헬프가 없습니다. 빠른 시작 버튼을 눌러 헬프를
            작성해보세요!
          </div>
        )}
      </div>
    </div>
  );
}
