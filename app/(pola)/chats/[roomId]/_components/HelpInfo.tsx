'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './HelpInfo.module.css';
import { HelpDetail } from '@/lib/models/helpDetail';
import { getCategoryName } from '@/lib/utils/categoryUtils';

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
        src={
          helpData.representativeImage &&
          helpData.representativeImage.length > 0
            ? helpData.representativeImage
            : '/help-img.jpg'
        }
        alt='help'
        width={64}
        height={64}
      />
      <div className={styles.helpTextWrap}>
        <h3 className={styles.helpTitle}>{helpData.title}</h3>
        <div className={styles.tags}>
          {helpData.category && helpData.category.length > 0 ? (
            helpData.category.map((cat, index) => (
              <span key={index} className={styles.tag}>
                {getCategoryName(cat.id)}
              </span>
            ))
          ) : (
            <span className={styles.tag}>기타</span>
          )}
        </div>
      </div>
      <span className={styles.prevHelp} onClick={handlePrevHelpClick}>
        이전 help 보기 {'>'}
      </span>
    </div>
  );
}
