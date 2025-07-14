"use client"
import { useEffect, useState } from 'react';
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
}

export default function JuniorHallOffamePage () {
  const [ranking, setRanking] = useState<UserRanking[]>([]);
  const [nicknameMap, setNicknameMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          .map(([userId, totalScore]) => ({ userId, totalScore }))
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
      <div className={styles.rankingTopWrap}>
        <ul>
          {ranking.slice(0, 3).map((item, idx) => (
            <li key={nicknameMap[item.userId] || item.userId}>
              <img 
                src={item.profileImage || "/default-profile.png"} 
                alt="프로필 이미지" 
              />
              <span className={styles.rankingTopName}>{nicknameMap[item.userId] || item.userId}</span>
              <span className={styles.rankingTopScore}>{item.totalScore.toLocaleString()}점</span>
            </li>
          ))}
        </ul>
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
                <span className={styles.rankingBtmAmount}>{item.totalScore.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 