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
import { useSeniorHelps } from '@/lib/hooks/help';
import { useUserScores } from '@/lib/hooks';
import { useJuniorAcceptedHelps } from '@/lib/hooks/junior';
import {
  CATEGORY_EMOJIS,
  CATEGORY_LABELS,
  CategoryName,
} from '@/lib/constants/userProfile';
import {
  calculateBigCategoryScores,
  getHighestCategory,
  getRepresentativeTitle,
  getCategoryClass,
  type CategoryInfo,
} from '@/lib/utils/userProfileUtils';

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
}) => {
  const { data: scores } = useUserScores();
  const { data: seniorHelps } = useSeniorHelps();
  const { data: juniorHelps } = useJuniorAcceptedHelps(nickname);

  if (!seniorHelps && !juniorHelps) {
    return <div>Loading...</div>;
  }

  const currentHelps = seniorHelps
    ? seniorHelps?.data
    : juniorHelps?.helps || [];

  const bigCategoryScores = scores
    ? calculateBigCategoryScores(scores)
    : {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };

  const chartData = [
    bigCategoryScores[1],
    bigCategoryScores[2],
    bigCategoryScores[3],
    bigCategoryScores[4],
    bigCategoryScores[5],
  ];

  const helpCategories: CategoryInfo[] = [
    { name: '힘', points: bigCategoryScores[1] },
    { name: '민첩', points: bigCategoryScores[2] },
    { name: '지능', points: bigCategoryScores[3] },
    { name: '매력', points: bigCategoryScores[4] },
    { name: '인내', points: bigCategoryScores[5] },
  ];

  const highestCategory = getHighestCategory(helpCategories);
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
    labels: CATEGORY_LABELS,
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
        <div className={styles.userHelpsChartContainer}>
          <Radar data={chartDataset} options={chartOptions} />
        </div>
        <div className={styles.userHelpsDataContainer}>
          <span className={styles.subTitle}>대표 칭호</span>
          <span className={styles.mainTitle}>{dynamicRepresentativeTitle}</span>
          {helpCategories.map((category, index) => {
            const getCategoryEmoji = (categoryName: string): string => {
              return CATEGORY_EMOJIS[categoryName as CategoryName] || '';
            };
            const badgeTitle = getRepresentativeTitle(
              category.name,
              category.points
            );
            return (
              <div className={styles.helpsDataContainer} key={index}>
                <div
                  className={`${styles.categoryBadge} ${getCategoryClass(
                    category.name,
                    styles
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
