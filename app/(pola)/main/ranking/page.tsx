"use client"
import styles from './Ranking.module.css';

const rankingData = [
  {
    rank: 1,
    name: '마산중앙고19기',
    amount: '+83,917.01',
    unit: '500만원',
    icon: '/crown.png',
    highlight: 'gold',
  },
  {
    rank: 2,
    name: '야수학교라니',
    amount: '+72,603.98',
    unit: '100만원',
    icon: '/silver.png',
    highlight: 'silver',
  },
  {
    rank: 3,
    name: '매일건다보면',
    amount: '+61,269.16',
    unit: '50만원',
    icon: '/bronze.png',
    highlight: 'bronze',
  },
];

const bottomRankingData = [
  { rank: 4, name: '닉네임4', amount: '+금액' },
  { rank: 5, name: '닉네임5', amount: '+금액' },
  { rank: 6, name: '닉네임6', amount: '+금액' },
  { rank: 7, name: '닉네임7', amount: '+금액' },
  { rank: 8, name: '닉네임8', amount: '+금액' },
  { rank: 9, name: '닉네임9', amount: '+금액' },
];

export default function RankingPage() {
  return (
    <div className={styles.rankingWrap}>
      <div className={styles.rankingTopWrap}>
        <ul>
          <li>
            <img src="/default-profile.png" alt="기본프로필" />
            <span className={styles.rankingTopName}>{rankingData[0].name}</span>
          </li>
          <li>
            <img src="/default-profile.png" alt="기본프로필" />
            <span className={styles.rankingTopName}>{rankingData[1].name}</span>
          </li>
          <li>
            <img src="/default-profile.png" alt="기본프로필" />
            <span className={styles.rankingTopName}>{rankingData[2].name}</span>
          </li>
        </ul>
        <div className={styles.curtain}>
          <div className={styles.curtainItemLeft}>
            <img src="/images/ranking/curtain_left.png" alt="커튼 왼쪽" />
          </div>
          <div className={styles.curtainItemright}>
            <img src="/images/ranking/curtain_right.png" alt="커튼 오른쪽" />
          </div>
        </div>
        <div className={styles.circleLights}>
        </div>
      </div>
      <div className={styles.rankingBtmWrap}>
        <ul>
          {bottomRankingData.map((item) => (
            <li key={item.rank} className={styles.rankingBtmItem}>
              <span className={styles.rankingBtmRank}>{item.rank}</span>
              <span className={styles.rankingBtmName}>{item.name}</span>
              <span className={styles.rankingBtmAmount}>{item.amount}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 