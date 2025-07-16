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

Chart.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface HelpCategory {
  name: string;
  points: number;
}

interface UserHelpsSectionProps {
  title?: string;
  moreLink?: string;
  chartLabels?: string[];
  chartData?: number[];
  representativeTitle?: string;
  helpCategories?: HelpCategory[];
}

const UserHelpsSection: React.FC<UserHelpsSectionProps> = ({
  title = "헬프 기록",
  moreLink = "/user/profile/achievement",
  chartLabels = ["청소", "요리", "운전", "상담", "기타"],
  chartData = [80, 65, 90, 70, 60],
  representativeTitle = "환경미화원",
  helpCategories = [
    { name: "청소", points: 1000000 },
    { name: "청소", points: 1000000 },
    { name: "청소", points: 1000000 },
    { name: "청소", points: 1000000 },
    { name: "청소", points: 1000000 },
  ],
}) => {
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
        backgroundColor: "rgba(68, 110, 232, 0.2)",
        borderColor: "#242425",
        borderWidth: 1,
        pointBackgroundColor: "rgba(68, 110, 232, 1)",
      },
    ],
  };

  return (
    <section className={styles.userHelpsSection}>
      <div className={styles.userHelpsTitleContainer}>
        <h2>{title}</h2>
        <div className={styles.userArchiveSectionTitleButton}>
          <Link href={moreLink}>더보기</Link>
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
          {helpCategories.map((category, index) => (
            <div className={styles.helpsDataContainer} key={index}>
              <div className={styles.helpsCategory}>{category.name}</div>
              <span className={styles.helpsCategoryPoint}>
                {category.points.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.userHelpList}></div>
    </section>
  );
};

export default UserHelpsSection;
