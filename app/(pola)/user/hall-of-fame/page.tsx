"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { API_ENDPOINTS } from "@/lib/constants/api";
import styles from "./Ranking.module.css";

interface UserRanking {
  nickname: string;
  totalScore: number;
  category: string;
  profileImg: string;
}

interface User {
  nickname: string;
  profile_img_url: string;
}

interface ScoreData {
  user_id: string;
  category_score: number;
  category_id: number;
  users: User;
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

        // 실제 API 호출 (axios 사용)
        const response = await axios.get(
          `${API_ENDPOINTS.SEASON_SCORES_WITH_PARAM}?season=1`
        );
        const scores: ScoreData[] = response.data;

        // 임시 카테고리 데이터
        const CATEGORIES = [
          "요리왕",
          "배달왕",
          "애견케어왕",
          "돌봄왕",
          "장보기왕",
          "수리왕",
          "청소왕",
          "이사왕",
          "노인케어왕",
          "정원왕",
        ];

        // nickname 기준으로 점수 합산
        const userScores: Record<string, number> = {};

        scores.forEach((score: ScoreData) => {
          const nickname = score.users?.nickname;
          const scoreValue = score.category_score || 0;

          if (nickname) {
            userScores[nickname] = (userScores[nickname] || 0) + scoreValue;
          }
        });

        // 랭킹 생성 (상위 10)
        const rankingData: UserRanking[] = Object.entries(userScores)
          .map(([nickname, totalScore]) => {
            // 해당 사용자의 첫 번째 점수에서 profile_img_url 가져오기
            const userScore = scores.find(
              (score: ScoreData) => score.users.nickname === nickname
            );
            const profileImg =
              userScore?.users?.profile_img_url ||
              "/images/dummies/dummy_user.png";

            // 해당 사용자의 가장 높은 점수 카테고리 찾기
            const userScores = scores.filter(
              (score: ScoreData) => score.users.nickname === nickname
            );
            const highestScore = userScores.reduce(
              (max: ScoreData, score: ScoreData) =>
                score.category_score > max.category_score ? score : max
            );
            const categoryName = CATEGORIES[highestScore.category_id] || "기타";

            return {
              nickname,
              totalScore,
              category: categoryName,
              profileImg: profileImg,
            };
          })
          .sort((a, b) => b.totalScore - a.totalScore)
          .slice(0, 10);

        setRanking(rankingData);
      } catch (err) {
        console.error("점수 조회 오류:", err);
        setError("점수를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  return (
    <div
      className={
        styles.rankingWrap + (skipAnimation ? " " + styles.skipAnim : "")
      }
    >
      <h1 className={`${styles.neon} ${styles.hallTitle} ${styles.neonFlash}`}>
        명예의 <span>전당</span>
      </h1>
      <div className={styles.rankingTopWrap}>
        <div className={styles.verticalLighting}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <ul>
          {ranking.slice(0, 3).map((item) => (
            <li key={item.nickname}>
              <div className={styles.imgwrap}>
                <Image
                  src={item.profileImg}
                  alt="프로필 이미지"
                  width={80}
                  height={80}
                />
              </div>
              <span className={styles.rankingTopScore}>
                {item.totalScore.toLocaleString()}
              </span>
              <span className={styles.rankingTopName}>{item.nickname}</span>
              <span className={styles.categoryLabel}>{item.category}</span>
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
              <li key={item.nickname} className={styles.rankingBtmItem}>
                <div className={styles.rankingBtmImgContainer}>
                  <Image
                    src={item.profileImg}
                    alt="프로필 이미지"
                    className={styles.rankingBtmImg}
                    width={40}
                    height={40}
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
          <Image
            src="/images/ranking/curtain_left.png"
            alt="커튼 왼쪽"
            width={200}
            height={400}
          />
        </div>
        <div className={styles.curtainItemright}>
          <Image
            src="/images/ranking/curtain_right.png"
            alt="커튼 오른쪽"
            width={200}
            height={400}
          />
        </div>
      </div>
      <div className={styles.circleLights}></div>
      {!skipAnimation && (
        <button
          className={styles.skipBtn}
          onClick={() => setSkipAnimation(true)}
        >
          애니메이션 스킵
        </button>
      )}
    </div>
  );
}
