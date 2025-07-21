"use client";
import Link from "next/link";
import { Radar } from "react-chartjs-2";
import {
  Chart,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "./userHelps.module.css";
import HelpListCard from "@/app/_components/commons/list-card/help-list-card/HelpListCard";
import { useScores } from "@/lib/hooks/useScores";
import { useSeniorHelps } from "@/lib/hooks/help";
import { useJuniorAcceptedHelps } from "@/lib/hooks";

Chart.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface UserHelpsSectionProps {
  title?: string;
  nickname: string;
  currentUserRole?: string;
}

const UserHelpsSection: React.FC<UserHelpsSectionProps> = ({
  title,
  nickname,
  currentUserRole,
}) => {
  // 사용자 점수 데이터
  const { data: scores } = useScores();
  // 사용자 역할에 따른 Help 데이터 조회
  const { data: seniorHelps } = useSeniorHelps();
  const { data: juniorHelps } = useJuniorAcceptedHelps(nickname);

  console.log(currentUserRole);

  // 로딩 상태 확인 (각각의 데이터가 로드되면 바로 사용)
  if (!seniorHelps && !juniorHelps) {
    return <div>Loading...</div>;
  }

  const currentHelps = seniorHelps
    ? seniorHelps?.data
    : juniorHelps?.helps || [];

  // 점수 데이터 타입 정의
  interface ScoreData {
    nickname: string;
    categoryId: number;
    season: number;
    categoryScore: number;
    updatedAt: string;
  }

  // 대분류별 점수 계산
  const calculateBigCategoryScores = (scores: ScoreData[]) => {
    const bigCategoryScores = {
      1: 0, // 힘
      2: 0, // 민첩
      3: 0, // 지능
      4: 0, // 매력
      5: 0, // 인내
    };

    scores?.forEach((score) => {
      const categoryId = score.categoryId;
      // categoryId가 이미 대분류 ID인 경우 (1-5)
      if (categoryId >= 1 && categoryId <= 5) {
        bigCategoryScores[categoryId as keyof typeof bigCategoryScores] =
          score.categoryScore;
      }
    });

    return bigCategoryScores;
  };

  const bigCategoryScores = scores
    ? calculateBigCategoryScores(scores)
    : {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };

  const chartLabels = ["힘", "민첩", "지능", "매력", "인내"];
  const chartData = [
    bigCategoryScores[1],
    bigCategoryScores[2],
    bigCategoryScores[3],
    bigCategoryScores[4],
    bigCategoryScores[5],
  ];
  const helpCategories = [
    { name: "힘", points: bigCategoryScores[1] },
    { name: "민첩", points: bigCategoryScores[2] },
    { name: "지능", points: bigCategoryScores[3] },
    { name: "매력", points: bigCategoryScores[4] },
    { name: "인내", points: bigCategoryScores[5] },
  ];

  // 가장 높은 점수를 가진 카테고리 찾기
  const getHighestCategory = () => {
    let highestCategory = helpCategories[0];
    helpCategories.forEach((category) => {
      if (category.points > highestCategory.points) {
        highestCategory = category;
      }
    });
    return highestCategory;
  };

  // 카테고리별 재치있는 칭호 생성
  const getRepresentativeTitle = (categoryName: string, points: number) => {
    const titles = {
      힘: [
        "근육맨",
        "헬스장의 왕",
        "파워하우스",
        "강철근육",
        "힘의 화신",
        "무쌍의 파워",
        "근력의 지배자",
        "강력한 수호자",
      ],
      민첩: [
        "재빠른 손길",
        "민첩한 고양이",
        "스피드 데몬",
        "날렵한 그림자",
        "빠른 발",
        "민첩의 달인",
        "스피드 마스터",
        "재빠른 도우미",
      ],
      지능: [
        "똑똑한 두뇌",
        "지혜의 샘",
        "브레인 마스터",
        "지적 거인",
        "현명한 조언자",
        "지혜로운 멘토",
        "두뇌의 지배자",
        "지능의 화신",
      ],
      매력: [
        "매력의 화신",
        "카리스마 리더",
        "매력적인 친구",
        "매력의 달인",
        "사랑받는 사람",
        "매력의 지배자",
        "카리스마 마스터",
        "매력의 샘",
      ],
      인내: [
        "끈기의 화신",
        "인내의 달인",
        "끈기있는 지원자",
        "인내의 지배자",
        "끈기의 마스터",
        "인내의 샘",
        "끈기있는 동반자",
        "인내의 화신",
      ],
    };

    const categoryTitles =
      titles[categoryName as keyof typeof titles] || titles["힘"];
    const titleIndex = Math.floor(points / 1000) % categoryTitles.length;
    return categoryTitles[titleIndex];
  };

  const highestCategory = getHighestCategory();
  const dynamicRepresentativeTitle = getRepresentativeTitle(
    highestCategory.name,
    highestCategory.points
  );
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      r: {
        angleLines: { display: true },
        suggestedMin: 0,
        suggestedMax: 100,
        pointLabels: {
          font: {
            size: 10,
          },
        },
        ticks: {
          stepSize: 20,
          font: { size: 10 },
        },
      },
    },
  };

  const chartDataset = {
    labels: chartLabels,
    datasets: [
      {
        label: "나의 헬프 능력치",
        data: chartData,
        backgroundColor: [
          "rgba(255, 0, 0, 0.2)", // 힘 - 빨강
          "rgba(144, 238, 144, 0.2)", // 민첩 - 연두
          "rgba(0, 0, 255, 0.2)", // 지능 - 파랑
          "rgba(255, 192, 203, 0.2)", // 매력 - 분홍
          "rgba(128, 0, 128, 0.2)", // 인내 - 보라
        ],
        borderColor: [
          "rgba(255, 0, 0, 1)", // 힘 - 빨강
          "rgba(144, 238, 144, 1)", // 민첩 - 연두
          "rgba(0, 0, 255, 1)", // 지능 - 파랑
          "rgba(255, 192, 203, 1)", // 매력 - 분홍
          "rgba(128, 0, 128, 1)", // 인내 - 보라
        ],
        borderWidth: 2,
        pointBackgroundColor: [
          "rgba(255, 0, 0, 1)", // 힘 - 빨강
          "rgba(144, 238, 144, 1)", // 민첩 - 연두
          "rgba(0, 0, 255, 1)", // 지능 - 파랑
          "rgba(255, 192, 203, 1)", // 매력 - 분홍
          "rgba(128, 0, 128, 1)", // 인내 - 보라
        ],
      },
    ],
  };

  return (
    <section className={styles.userHelpsSection}>
      <div className={styles.userHelpsTitleContainer}>
        <h2>{title}</h2>
        <div className={styles.userArchiveSectionTitleButton}>
          <Link href={`/user/profile/${nickname}/helps`}>더보기</Link>
        </div>
      </div>
      <div className={styles.userHelpsContentContainer}>
        {/* 카테고리 뱃지 라벨 */}
        {/* <div className={styles.categoryBadgeRow}>
          {categoryBadges.map((badge) => (
            <div
              key={badge.name}
              className={`${styles.categoryBadge} ${badge.className}`}
              title={badge.name}
            >
              {badge.emoji}
            </div>
          ))}
        </div> */}
        {/* 오른쪽에 배너/기록 등 추가 */}
        <div className={styles.userHelpsChartContainer}>
          <Radar data={chartDataset} options={chartOptions} />
        </div>
        <div className={styles.userHelpsDataContainer}>
          <span className={styles.subTitle}>대표 칭호</span>
          <span className={styles.mainTitle}>{dynamicRepresentativeTitle}</span>
          {helpCategories.map((category, index) => {
            const getCategoryClass = (categoryName: string): string => {
              switch (categoryName) {
                case "힘":
                  return styles.categoryBadgeStrength;
                case "민첩":
                  return styles.categoryBadgeAgility;
                case "지능":
                  return styles.categoryBadgeIntelligence;
                case "매력":
                  return styles.categoryBadgeCharm;
                case "인내":
                  return styles.categoryBadgeEndurance;
                default:
                  return "";
              }
            };
            const getCategoryEmoji = (categoryName: string): string => {
              switch (categoryName) {
                case "힘":
                  return "💪";
                case "민첩":
                  return "🏃‍♂️";
                case "지능":
                  return "🧠";
                case "매력":
                  return "✨";
                case "인내":
                  return "🏔️";
                default:
                  return "";
              }
            };
            // 카테고리별 칭호 생성
            const badgeTitle = getRepresentativeTitle(
              category.name,
              category.points
            );
            return (
              <div className={styles.helpsDataContainer} key={index}>
                <div
                  className={`${styles.categoryBadge} ${getCategoryClass(
                    category.name
                  )}`}
                  title={badgeTitle}
                >
                  {getCategoryEmoji(category.name)}
                </div>
                <span className={styles.helpsCategoryPoint}>
                  {category.points.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.userHelpList}>
        {currentHelps.map((help) => (
          <HelpListCard key={help.id} help={help} />
        ))}
      </div>
    </section>
  );
};

export default UserHelpsSection;
