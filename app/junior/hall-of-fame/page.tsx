"use client"
import { useEffect, useState, useRef } from 'react';
import styles from './Ranking.module.css';
import axios from 'axios';

// interface Score {
//   userId: string;
//   categoryScore: number;
//   updatedAt: string;
// }

interface UserRanking {
  userId: string;
  nickname: string;
  totalScore: number;
}

// 임시 카테고리 데이터
// const categories = [
//   '요리왕', '배달왕', '애견케어왕', '돌봄왕', '장보기왕', 
//   '수리왕', '청소왕', '이사왕', '노인케어왕', '정원왕'
// ];

export default function JuniorHallOffamePage () {
  const [ranking, setRanking] = useState<UserRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const neonRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get('/api/scores/season?season=1');
        const raw = response.data;
        console.log('API 응답 데이터:', raw);

        // nickname 기준으로 category_score 합산
        const userScoreMap: Record<string, { nickname: string; totalScore: number }> = {};
        raw.forEach((score: any) => {
          const key = score.nickname || score.user_id;
          if (!key) return;
          if (!userScoreMap[key]) {
            userScoreMap[key] = {
              nickname: score.nickname || '',
              totalScore: 0,
            };
          }
          userScoreMap[key].totalScore += score.categoryScore ?? score.category_score ?? 0;
        });

        // 내림차순 정렬 후 상위 10명
        const rankingArr: UserRanking[] = Object.entries(userScoreMap)
          .map(([userId, { nickname, totalScore }]) => ({
            userId,
            nickname,
            totalScore: Number(totalScore),
          }))
          .sort((a, b) => b.totalScore - a.totalScore)
          .slice(0, 10);

        console.log('합산 후 랭킹 데이터:', rankingArr);
        setRanking(rankingArr);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류');
      } finally {
        setLoading(false);
      }
    };
    fetchScores();
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
            <li key={item.userId}>
              <img 
                src="/dummy_user.png" 
                alt="프로필 이미지" 
              />
              <span className={styles.rankingTopScore}>{item.totalScore.toLocaleString()}점</span>
              <span className={styles.rankingTopName}>{item.nickname || item.userId}</span>
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
              <li key={item.userId} className={styles.rankingBtmItem}>
                <div className={styles.rankingBtmImgContainer}>
                  <img 
                    src="/dummy_user.png" 
                    alt="프로필 이미지" 
                    className={styles.rankingBtmImg} 
                  />
                  <span className={styles.rankingBtmRank}>{idx + 4}</span>
                  <span className={styles.rankingBtmName}>{item.nickname || item.userId}</span>
                </div>
                <div className={styles.rankingBtmAmount}>
                  <span>{item.totalScore.toLocaleString()}점</span>
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