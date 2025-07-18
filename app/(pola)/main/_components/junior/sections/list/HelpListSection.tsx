import Link from 'next/link';
import styles from './HelpListSection.module.css';
import HelpListCard from '@/app/_components/commons/list-card/help-list-card/HelpListCard';

interface Help {
  id: number;
  title: string;
  content: string;
  startDate: string;
  endDate: string;
  status: string;
  category: number[];
  seniorNickname: string;
}

interface HelpListSectionProps {
  filteredHelps: Help[];
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