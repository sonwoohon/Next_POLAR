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
import UserInfoSection from "@/app/_components/commons/UserInfoSection";

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

      {/* 유저 티어 */}
      {/* TODO: 컴포넌트 분리 */}
      <section className={styles.userTierSection}>
        <h2>티어</h2>
        <div className={styles.userTierContainer}>
          <div className={styles.userTierInfo}>
            <div className={styles.userTierImage}></div>
            <div className={styles.userTierInfoTextContainer}>
              <span className={styles.userTierSeason}>2025 - 1시즌</span>
              <span className={styles.userTierName}>SILVER</span>
            </div>
          </div>
          {/* 프로그레스바 */}
          <div className={styles.userTierProgressBarWrapper}>
            <div className={styles.userTierProgressInfo}>
              <span>
                다음 티어까지 <b>35,000</b>점
              </span>
            </div>
            <div className={styles.userTierProgressBarBg}>
              <div
                className={styles.userTierProgressBarFill}
                style={{ width: "95%" }} // 예시: 765,000/800,000
              ></div>
            </div>
            <div className={styles.userTierProgressBarScore}>
              765,000 <span>/800,000</span>
            </div>
          </div>
        </div>
      </section>

      {/* 칭호 뱃지  */}
      <section className={styles.userArchiveSection}>
        <div className={styles.userArchiveSectionTitleContainer}>
          <h2>유저 업적</h2>
          <div className={styles.userArchiveSectionTitleButton}>
            <Link href="/user/profile/achievement">더보기</Link>
          </div>
        </div>
        <div className={styles.userArchiveBadgeGrid}>
          {Array.from({ length: 16 }).map((_, i) => (
            <div className={styles.userArchiveBadgeItem} key={i}>
              🧹
              <div className={styles.userArchiveBadgeTooltip}>청소마스터</div>
            </div>
          ))}
        </div>
      </section>

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
