import Link from 'next/link';
import styles from './HelpListSection.module.css';
import HelpListCard from '@/app/_components/commons/list-card/HelpListCard';

interface HelpListSectionProps {
  filteredHelps: any[];
}

export default function HelpListSection({ filteredHelps }: HelpListSectionProps) {
  return (
    <div className={styles.helpList}>
      {filteredHelps.map((help) => (
        <Link key={help.id} href={`/helps/${help.id}`}>
          <HelpListCard 
            help={{
              id: help.id,
              title: help.title,
              content: help.content,
              startDate: new Date(help.startDate),
              endDate: new Date(help.endDate),
              status: help.status,
              category: help.category,
              seniorInfo: { nickname: help.seniorNickname },
              createdAt: new Date(help.startDate)
            }}
          />
        </Link>
      ))}
    </div>
  );
} 