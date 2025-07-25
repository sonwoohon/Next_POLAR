import { useQuery } from '@tanstack/react-query';
import { scoreApi } from '../api_front/score.api';
import { UserRanking, ScoreData } from '../models/ranking';
import { CATEGORIES } from '../constants/categories';

// 명예의 전당 랭킹 데이터 변환 함수
const transformRankingData = (scores: ScoreData[]): UserRanking[] => {
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
  return Object.entries(userScores)
    .map(([nickname, totalScore]) => {
      // 해당 사용자의 첫 번째 점수에서 profile_img_url 가져오기
      const userScore = scores.find(
        (score: ScoreData) => score.users.nickname === nickname
      );
      const profileImg =
        userScore?.users?.profile_img_url || '/images/dummies/dummy_user.png';

      // 해당 사용자의 가장 높은 점수 카테고리 찾기
      const userScores = scores.filter(
        (score: ScoreData) => score.users.nickname === nickname
      );
      const highestScore = userScores.reduce(
        (max: ScoreData, score: ScoreData) =>
          score.category_score > max.category_score ? score : max
      );
      const categoryName = CATEGORIES[highestScore.category_id] || '기타';

      return {
        nickname,
        totalScore,
        category: categoryName,
        profileImg: profileImg,
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 10);
};

// 명예의 전당 랭킹 조회 hook
export const useHallOfFameRanking = (season: number = 1) => {
  return useQuery({
    queryKey: ['hallOfFameRanking', season],
    queryFn: async () => {
      const scores = await scoreApi.getSeasonScoresWithParam(season);
      return transformRankingData(scores);
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};
