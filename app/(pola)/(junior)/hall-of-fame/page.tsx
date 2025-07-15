"use client"
import { useEffect, useState, useRef } from 'react';
import styles from './Ranking.module.css';

interface Score {
  userId: string;
  categoryId: number;
  season: number;
  categoryScore: number;
  updatedAt: string;
}

interface UserRanking {
  userId: string;
  totalScore: number;
  profileImage?: string; // 유저 프로필 이미지 (선택적)
  category?: string; // 카테고리 추가
}

// 임시 카테고리 데이터
const categories = [
  '요리왕', '배달왕', '애견케어왕', '돌봄왕', '장보기왕', 
  '수리왕', '청소왕', '이사왕', '노인케어왕', '정원왕'
];

export default function JuniorHallOffamePage () {
  const [ranking, setRanking] = useState<UserRanking[]>([]);
  const [nicknameMap, setNicknameMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const neonRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const fetchScoresAndNicknames = async () => {
      try {
        setLoading(true);
        setError(null);
        // 1. 점수 데이터 가져오기
        const response = await fetch('/api/scores/season?season=1');
        if (!response.ok) throw new Error('점수 데이터를 불러오지 못했습니다.');
        const scores: Score[] = await response.json();
        // userId별로 점수 합산
        const userScoreMap: Record<string, number> = {};
        scores.forEach((score) => {
          if (!userScoreMap[score.userId]) userScoreMap[score.userId] = 0;
          userScoreMap[score.userId] += score.categoryScore;
        });
        // 배열로 변환 후 내림차순 정렬
        const rankingArr: UserRanking[] = Object.entries(userScoreMap)
          .map(([userId, totalScore]) => ({ 
            userId, 
            totalScore,
            category: categories[Math.floor(Math.random() * categories.length)] // 임시로 랜덤 카테고리 할당
          }))
          .sort((a, b) => b.totalScore - a.totalScore)
          .slice(0, 10); // 상위 10명
        setRanking(rankingArr);

        // 2. userId(uuid)로 nickname 매핑 가져오기
        const { getNicknameByUuid } = await import('@/lib/getUserName');
        const nicknameEntries = await Promise.all(
          rankingArr.map(async (item) => {
            const nickname = await getNicknameByUuid(item.userId);
            return [item.userId, nickname || item.userId];
          })
        );
        setNicknameMap(Object.fromEntries(nicknameEntries));
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류');
      } finally {
        setLoading(false);
      }
    };
    fetchScoresAndNicknames();
  }, []);

  return (
    <div className={styles.rankingWrap}>
      <h1 className={`${styles.neon} ${styles.hallTitle} ${styles.neonFlash}`}>명예의 <span>전당</span></h1>
      <div className={styles.rankingTopWrap}>
        <div className={styles.verticalLighting}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <ul>
          {ranking.slice(0, 3).map((item, idx) => (
            <li key={nicknameMap[item.userId] || item.userId}>
              <img 
                src={item.profileImage || "/default-profile.png"} 
                alt="프로필 이미지" 
              />
              <span className={styles.rankingTopName}>{nicknameMap[item.userId] || item.userId}</span>
              <span className={styles.rankingTopScore}>{item.totalScore.toLocaleString()}점</span>
              <div className={`${styles.categoryLabel} ${styles[`category-${item.category}`]}`} style={{ marginTop: '.5rem' }}>
                <span>{item.category}</span>
                {/* ! 실제 데이터로 교체할 때는 item.category 부분만 실제 카테고리 데이터로 바꾸면 됩니다. */}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.rankingBtmWrap}>
        {loading || error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <ul>
            {ranking.slice(3, 10).map((item, idx) => (
              <li key={nicknameMap[item.userId] || item.userId} className={styles.rankingBtmItem}>
                <div className={styles.rankingBtmImgContainer}>
                  <img 
                    src={item.profileImage || "/default-profile.png"} 
                    alt="프로필 이미지" 
                    className={styles.rankingBtmImg} 
                  />
                  <span className={styles.rankingBtmRank}>{idx + 4}</span>
                </div>
                <span className={styles.rankingBtmName}>{nicknameMap[item.userId] || item.userId}</span>
                <div className={styles.rankingBtmAmount}>
                  <div className={`${styles.categoryLabel} ${styles[`category-${item.category}`]}`}>
                    <span>{item.category}</span>
                    {/* ! 실제 데이터로 교체할 때는 item.category 부분만 실제 카테고리 데이터로 바꾸면 됩니다. */}
                  </div>
                  <span>{item.totalScore.toLocaleString()}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={styles.curtain}>
        <div className={styles.curtainItemLeft}>
          <img src="/images/ranking/curtain_left.png" alt="커튼 왼쪽" />
        </div>
        <div className={styles.curtainItemright}>
          <img src="/images/ranking/curtain_right.png" alt="커튼 오른쪽" />
        </div>
      </div>
        <div className={styles.circleLights}></div>
    </div>
  );
} 