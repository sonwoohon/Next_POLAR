'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './HelpInfo.module.css';
import { HelpDetail } from '@/lib/models/helpDetail';
import CategoryBadge from '@/app/_components/category-badge/CategoryBadge';
import DummyHelp from '@/public/images/dongHyun.jpg';

interface HelpInfoProps {
  roomId: number;
  helpData: HelpDetail;
}

export default function HelpInfo({ roomId, helpData }: HelpInfoProps) {
  const router = useRouter();

  const handlePrevHelpClick = () => {
    router.push(`/chats/${roomId}/history`);
  };

  return (
    <div className={styles.helpInfo}>
      <Image
        className={styles.helpImg}
        src={helpData.representativeImage || DummyHelp}
        alt='help'
        width={64}
        height={64}
      />
      <div className={styles.helpTextWrap}>
        <h3 className={styles.helpTitle}>{helpData.title}</h3>
        <div className={styles.tags}>
          {helpData.category && helpData.category.length > 0 ? (
            helpData.category
              .slice(0, 2)
              .map((cat, index) => (
                <CategoryBadge
                  key={index}
                  category={cat.id}
                  className={styles.helpCategoryBadge}
                />
              ))
          ) : (
            <CategoryBadge category={0} className={styles.helpCategoryBadge} />
          )}
          {helpData.category && helpData.category.length > 2 && (
            <span className={styles.moreCategories}>
              +{helpData.category.length - 2}
            </span>
          )}
        </div>
      </div>
      <span className={styles.prevHelp} onClick={handlePrevHelpClick}>
        이전 help 보기 {'>'}
      </span>
    </div>
  );
}
