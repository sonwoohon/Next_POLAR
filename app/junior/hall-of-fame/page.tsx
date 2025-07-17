"use client"
import { useEffect, useState } from 'react';
import styles from './Ranking.module.css';

interface UserRanking {
  userId: string;
  nickname: string;
  totalScore: number;
  category: string;
  profileImg: string;
}

export default function JuniorHallOffamePage() {
const [ranking, setRanking] = useState<UserRanking[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [skipAnimation, setSkipAnimation] = useState(false);

useEffect(() => {
    const fetchScores = async () => {
    try {
        setLoading(true);
        setError(null);

        // 실제 API 호출 (기존 API만 사용)
        const response = await fetch('/api/scores/season?season=1');
        if (!response.ok) {
        throw new Error('점수 조회에 실패했습니다.');
        }
        
        const scores = await response.json();
        console.log('API 응답:', scores);

        // 임시 카테고리 데이터
        const categories = ['요리왕', '배달왕', '애견케어왕', '돌봄왕', '장보기왕', 
        '수리왕', '청소왕', '이사왕', '노인케어왕', '정원왕'];
        
        // user_id 기준으로 점수 합산
        const userScores: Record<string, number> = {};
        
        scores.forEach((score: any) => {
        const userId = score.user_id;
        const scoreValue = score.category_score || 0;
        
        if (userId) {
            userScores[userId] = (userScores[userId] || 0) + scoreValue;
        }
        });

        // 랭킹 생성 (상위 10)
        const rankingData: UserRanking[] = Object.entries(userScores)
        .map(([userId, totalScore]) => {
            // 해당 사용자의 첫 번째 점수에서 nickname과 profile_img_url 가져오기
            const userScore = scores.find((score: any) => score.user_id === userId);
            const nickname = userScore?.users?.nickname || `User_${userId}`;
            const profileImg = userScore?.users?.profile_img_url || "/images/dummies/dummy_user.png";
            
            // 해당 사용자의 가장 높은 점수 카테고리 찾기
            const userScores = scores.filter((score: any) => score.user_id === userId);
            const highestScore = userScores.reduce((max: any, score: any) => 
            score.category_score > max.category_score ? score : max
            );
            const categoryName = categories[highestScore.category_id] || '기타';
            
            return {
            userId,
            nickname: nickname,
            totalScore,
            category: categoryName,
            profileImg: profileImg
            };
        })
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, 10);

        setRanking(rankingData);
        console.log('랭킹 데이터:', rankingData);
        
    } catch (err) {
        console.error('점수 조회 오류:', err);
        setError('점수를 불러오는 중 오류가 발생했습니다.');
    } finally {
        setLoading(false);
    }
    };

    fetchScores();
}, []);

return (
    <div className={styles.rankingWrap + (skipAnimation ? ' ' + styles.skipAnim : '')}>
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
                <div className={styles.imgwrap}><img src={item.profileImg} alt="프로필 이미지" /></div>
                <span className={styles.rankingTopScore}>{item.totalScore.toLocaleString()}</span>
                <span className={styles.rankingTopName}>{item.nickname}</span>
                <span className={styles.categoryLabel}>
                    {item.category}
                </span>
            </li>
        ))}
        </ul>
    </div>
    <div className={styles.rankingBtmWrap}>
        {loading ? (
        <p>로딩 중...</p>
        ) : error ? (
        <p className={styles.error}>{error}</p>
        ) : (
        <ul>
            {ranking.slice(3, 10).map((item, idx) => (
            <li key={item.userId} className={styles.rankingBtmItem}>
                <div className={styles.rankingBtmImgContainer}>
                <img 
                    src={item.profileImg} 
                    alt="프로필 이미지" 
                    className={styles.rankingBtmImg} 
                />
                <span className={styles.rankingBtmRank}>{idx + 4}</span>
                <span className={styles.rankingBtmName}>{item.nickname}</span>
                </div>
                <div className={styles.rankingBtmAmount}>
                    <span className={styles.categoryLabel}>{item.category}</span>
                <span>{item.totalScore.toLocaleString()}</span>
                </div>
            </li>
            ))}
        </ul>
        )}
    </div>
    <div className={styles.curtain}>
        <div className={styles.curtainItemLeft}>
        <img src="/images/ranking/curtain_left.png" alt="커튼 왼쪽"/>
        </div>
        <div className={styles.curtainItemright}>
        <img src="/images/ranking/curtain_right.png" alt="커튼 오른쪽"/>
        </div>
    </div>
    <div className={styles.circleLights}></div>
    {!skipAnimation && (
      <button
        className={styles.skipBtn}
        onClick={() => setSkipAnimation(true)}>
        애니메이션 스킵
      </button>
    )}
    </div>
    
);
} 