'use client';
import Link from 'next/link';
import { Radar } from 'react-chartjs-2';
import {
  Chart,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import styles from './userHelps.module.css';
import HelpListCard from '@/app/_components/commons/list-card/help-list-card/HelpListCard';
import { useScores } from '@/lib/hooks/useScores';
import { useSeniorHelps } from '@/lib/hooks/help';
import { useJuniorAcceptedHelps } from '@/lib/hooks';

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
  representativeTitle?: string;
  currentUserRole?: string;
}

const UserHelpsSection: React.FC<UserHelpsSectionProps> = ({
  title,
  nickname,
  representativeTitle,
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

  const chartLabels = ['힘', '민첩', '지능', '매력', '인내'];
  const chartData = [
    bigCategoryScores[1],
    bigCategoryScores[2],
    bigCategoryScores[3],
    bigCategoryScores[4],
    bigCategoryScores[5],
  ];
  const helpCategories = [
    { name: '힘', points: bigCategoryScores[1] },
    { name: '민첩', points: bigCategoryScores[2] },
    { name: '지능', points: bigCategoryScores[3] },
    { name: '매력', points: bigCategoryScores[4] },
    { name: '인내', points: bigCategoryScores[5] },
  ];
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
        label: '나의 헬프 능력치',
        data: chartData,
        backgroundColor: [
          'rgba(255, 0, 0, 0.2)', // 힘 - 빨강
          'rgba(144, 238, 144, 0.2)', // 민첩 - 연두
          'rgba(0, 0, 255, 0.2)', // 지능 - 파랑
          'rgba(255, 192, 203, 0.2)', // 매력 - 분홍
          'rgba(128, 0, 128, 0.2)', // 인내 - 보라
        ],
        borderColor: [
          'rgba(255, 0, 0, 1)', // 힘 - 빨강
          'rgba(144, 238, 144, 1)', // 민첩 - 연두
          'rgba(0, 0, 255, 1)', // 지능 - 파랑
          'rgba(255, 192, 203, 1)', // 매력 - 분홍
          'rgba(128, 0, 128, 1)', // 인내 - 보라
        ],
        borderWidth: 2,
        pointBackgroundColor: [
          'rgba(255, 0, 0, 1)', // 힘 - 빨강
          'rgba(144, 238, 144, 1)', // 민첩 - 연두
          'rgba(0, 0, 255, 1)', // 지능 - 파랑
          'rgba(255, 192, 203, 1)', // 매력 - 분홍
          'rgba(128, 0, 128, 1)', // 인내 - 보라
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
        {/* 오른쪽에 배너/기록 등 추가 */}
        <div className={styles.userHelpsChartContainer}>
          <Radar data={chartDataset} options={chartOptions} />
        </div>
        <div className={styles.userHelpsDataContainer}>
          <span className={styles.subTitle}>대표 칭호</span>
          <span className={styles.mainTitle}>{representativeTitle}</span>
          {helpCategories.map((category, index) => {
            const getCategoryClass = (categoryName: string): string => {
              switch (categoryName) {
                case '힘':
                  return styles.helpsCategoryStrength;
                case '민첩':
                  return styles.helpsCategoryAgility;
                case '지능':
                  return styles.helpsCategoryIntelligence;
                case '매력':
                  return styles.helpsCategoryCharm;
                case '인내':
                  return styles.helpsCategoryEndurance;
                default:
                  return '';
              }
            };

            return (
              <div className={styles.helpsDataContainer} key={index}>
                <div
                  className={`${styles.helpsCategory} ${getCategoryClass(
                    category.name
                  )}`}
                >
                  {category.name}
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
