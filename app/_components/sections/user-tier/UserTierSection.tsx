'use client';
import styles from './userTier.module.css';
import Image from 'next/image';
import ironBadge from '@/public/images/logos/iron.webp';
import bronzeBadge from '@/public/images/logos/bronze.webp';
import silverBadge from '@/public/images/logos/silver.webp';
import goldBadge from '@/public/images/logos/gold.webp';
import platinumBadge from '@/public/images/logos/platinum.webp';
import { useUserScoresBySeason } from '@/lib/hooks';

interface UserTierSectionProps {
  seasonNumber?: number;
}

const UserTierSection: React.FC<UserTierSectionProps> = ({
  seasonNumber = 1,
}) => {
  const { data: scores } = useUserScoresBySeason(seasonNumber);
  // 카테고리별 점수들을 모두 합산하여 총 점수 계산
  const userScore =
    scores?.reduce((total, score) => total + score.categoryScore, 0) || 0;
  const seasonDisplay = `2025 - ${seasonNumber}시즌`;
  // 티어 계산 로직 (점수 기반)
  const getTierInfo = (score: number) => {
    if (score >= 100000)
      return {
        name: 'DIAMOND',
        maxScore: 100000,
        nextScore: 0,
        minScore: 70000,
      };
    if (score >= 70000)
      return {
        name: 'PLATINUM',
        maxScore: 100000,
        nextScore: 100000 - score,
        minScore: 30000,
      };
    if (score >= 30000)
      return {
        name: 'GOLD',
        maxScore: 70000,
        nextScore: 70000 - score,
        minScore: 10000,
      };
    if (score >= 10000)
      return {
        name: 'SILVER',
        maxScore: 30000,
        nextScore: 30000 - score,
        minScore: 5000,
      };
    if (score >= 5000)
      return {
        name: 'BRONZE',
        maxScore: 10000,
        nextScore: 10000 - score,
        minScore: 0,
      };
    return {
      name: 'IRON',
      maxScore: 5000,
      nextScore: 5000 - score,
      minScore: 0,
    };
  };

  const tierInfo = getTierInfo(userScore);

  // 티어별 뱃지 이미지 선택
  const getTierBadge = (tierName: string) => {
    switch (tierName) {
      case 'IRON':
        return ironBadge;
      case 'BRONZE':
        return bronzeBadge;
      case 'SILVER':
        return silverBadge;
      case 'GOLD':
        return goldBadge;
      case 'PLATINUM':
        return platinumBadge;
      case 'DIAMOND':
        return platinumBadge; // DIAMOND는 PLATINUM과 같은 이미지 사용
      default:
        return ironBadge;
    }
  };

  // 현재 티어에서의 진행도 계산 (0~100%)
  const currentTierProgress =
    tierInfo.name === 'DIAMOND'
      ? 100
      : Math.min(
          ((userScore - tierInfo.minScore) /
            (tierInfo.maxScore - tierInfo.minScore)) *
            100,
          100
        );

  return (
    <section className={styles.userTierSection}>
      <h2>티어</h2>
      <div
        className={`${styles.userTierContainer} ${
          styles[`userTierContainer${tierInfo.name.toLowerCase()}`]
        }`}
      >
        <div className={styles.userTierInfo}>
          <div className={styles.userTierImage}>
            <Image
              src={getTierBadge(tierInfo.name)}
              alt={`${tierInfo.name} 티어 뱃지`}
              width={96}
              height={96}
              priority={false}
              placeholder='blur'
              blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
            />
          </div>
          <div className={styles.userTierInfoTextContainer}>
            <span className={styles.userTierSeason}>{seasonDisplay}</span>
            <span className={styles.userTierName}>{tierInfo.name}</span>
          </div>
        </div>
        {/* 프로그레스바 */}
        <div className={styles.userTierProgressBarWrapper}>
          <div className={styles.userTierProgressInfo}>
            <span>
              다음 티어까지 <b>{tierInfo.nextScore.toLocaleString()}</b>점
            </span>
            <span className={styles.totalContribution}>
              총 공경력 : {userScore.toLocaleString()}
            </span>
          </div>
          <div className={styles.userTierProgressBarBg}>
            <div
              className={`${styles.userTierProgressBarFill} ${
                styles[`userTierProgressBarFill${tierInfo.name.toLowerCase()}`]
              }`}
              style={{ width: `${currentTierProgress}%` }}
            ></div>
          </div>
          <div className={styles.userTierProgressBarScore}>
            {userScore.toLocaleString()}{' '}
            <span>/{tierInfo.maxScore.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserTierSection;
