"use client";
import styles from "./_styles/userProfile.module.css";
import { useParams } from "next/navigation";
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
import UserInfoSection from "@/app/_components/sections/user-info/UserInfoSection";
import UserTierSection from "@/app/_components/sections/user-tier/UserTierSection";
import UserArchivmentSection from "@/app/_components/sections/user-archivment/UserArchivmentSection";

Chart.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const UserProfilePage: React.FC = () => {
  const params = useParams();
  const nickname = decodeURIComponent(params.nickname as string);

  return (
    <div className={styles.container}>
      <h1>유저프로필</h1>
      <UserInfoSection
        nickname={nickname}
        userName="사나이"
        userType="Jr."
        rating={4.5}
        archiveBadge="환경미화원"
      />

      <UserTierSection
        season="2025 - 1시즌"
        tierName="SILVER"
        currentScore={765000}
        maxScore={800000}
        nextTierScore={35000}
        progressPercentage={95}
      />

      <UserArchivmentSection />

      {/* 헬프 기록 */}
      <section className={styles.userHelpsSection}>
        <div className={styles.userHelpsTitleContainer}>
          <h2>헬프 기록</h2>
          <div className={styles.userArchiveSectionTitleButton}>
            <Link href="/user/profile/achievement">더보기</Link>
          </div>
        </div>
        <div className={styles.userHelpsContentContainer}>
          {/* 오른쪽에 배너/기록 등 추가 */}
          <div className={styles.userHelpsChartContainer}>
            <Radar
              data={{
                labels: ["청소", "요리", "운전", "상담", "기타"],
                datasets: [
                  {
                    label: "나의 헬프 능력치",
                    data: [80, 65, 90, 70, 60], // 예시 값
                    backgroundColor: "rgba(68, 110, 232, 0.2)",
                    borderColor: "#242425",
                    borderWidth: 1,
                    pointBackgroundColor: "rgba(68, 110, 232, 1)",
                  },
                ],
              }}
              options={{
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
              }}
            />
          </div>
          <div className={styles.userHelpsDataContainer}>
            <span className={styles.subTitle}>대표 칭호</span>
            <span className={styles.mainTitle}>환경미화원</span>
            <div className={styles.helpsDataContainer}>
              <div className={styles.helpsCategory}>청소</div>
              <span className={styles.helpsCategoryPoint}>1,000,000</span>
            </div>

            <div className={styles.helpsDataContainer}>
              <div className={styles.helpsCategory}>청소</div>
              <span className={styles.helpsCategoryPoint}>1,000,000</span>
            </div>

            <div className={styles.helpsDataContainer}>
              <div className={styles.helpsCategory}>청소</div>
              <span className={styles.helpsCategoryPoint}>1,000,000</span>
            </div>

            <div className={styles.helpsDataContainer}>
              <div className={styles.helpsCategory}>청소</div>
              <span className={styles.helpsCategoryPoint}>1,000,000</span>
            </div>

            <div className={styles.helpsDataContainer}>
              <div className={styles.helpsCategory}>청소</div>
              <span className={styles.helpsCategoryPoint}>1,000,000</span>
            </div>
          </div>
        </div>

        <div className={styles.userHelpList}></div>
      </section>
    </div>
  );
};

export default UserProfilePage;
