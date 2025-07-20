import Link from 'next/link';
import styles from './HelpListSection.module.css';
import HelpListCard from '@/app/_components/commons/list-card/help-list-card/HelpListCard';
import { HelpListResponseDto } from '@/backend/helps/applications/dtos/HelpDTO';

interface HelpListSectionProps {
  filteredHelps: HelpListResponseDto[];
  isLoading?: boolean;
  error?: Error | null;
}

export default function HelpListSection({
  filteredHelps,
  isLoading = false,
  error = null,
}: HelpListSectionProps) {
  if (isLoading) {
    return (
      <div className={styles.helpList}>
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          로딩 중...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.helpList}>
        <div style={{ textAlign: 'center', padding: '20px', color: '#ff4444' }}>
          데이터를 불러오는데 실패했습니다.
        </div>
      </div>
    );
  }

  if (filteredHelps.length === 0) {
    return (
      <div className={styles.helpList}>
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          해당 조건의 도움 요청이 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.helpList}>
      {filteredHelps.map((help) => (
        <Link key={help.id} href={`/helps/${help.id}`}>
          <HelpListCard help={help} />
        </Link>
      ))}
    </div>
  );
}
