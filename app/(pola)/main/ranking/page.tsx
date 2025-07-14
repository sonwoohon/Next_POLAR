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
}

export default function RankingPage() {
  const [ranking, setRanking] = useState<UserRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        setLoading(true);
        setError(null);
        // 시즌 1 기준, 필요시 변수로 변경 가능
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
          .slice(0, 9); // 상위 9명
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
    <main className={styles.rankingWrap}>
      <div className={styles.rankingTopWrap}>
        <ul>
          {ranking.slice(0, 3).map((item, idx) => (
            <li key={item.userId}>
              {/*
              // TODO: 추후 유저 프로필 이미지가 준비되면 아래 코드의 주석을 해제하세요.
              <img src="/default-profile.png" alt="기본프로필" />
              */}
              <span className={styles.rankingTopName}>{item.userId}</span>
              <span>{item.totalScore.toLocaleString()}점</span>
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
        {loading ? (
          <p>로딩 중...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <ul>
            {ranking.slice(3, 9).map((item, idx) => (
              <li key={item.userId} className={styles.rankingBtmItem}>
                {/*
                // TODO: 추후 유저 프로필 이미지가 준비되면 아래 코드의 주석을 해제하세요.
                <div className={styles.rankingBtmImgContainer}>
                  <img src="/default-profile.png" alt="기본프로필" className={styles.rankingBtmImg} />
                  <span className={styles.rankingBtmRank}>{idx + 4}</span>
                </div>
                */}
                <span className={styles.rankingBtmRank}>{idx + 4}</span>
                <span className={styles.rankingBtmName}>{item.userId}</span>
                <span className={styles.rankingBtmAmount}>{item.totalScore.toLocaleString()}점</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
} 