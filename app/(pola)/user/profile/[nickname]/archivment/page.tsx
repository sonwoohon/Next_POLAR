"use client";
import { useState } from "react";
import styles from "./archivment.module.css";

interface Badge {
  id: number;
  name: string;
  description: string;
  emoji: string;
  isUnlocked: boolean;
  unlockDate?: string;
  category: string;
}

const ArchivmentPage: React.FC = () => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 예시 뱃지 데이터
  const badges: Badge[] = [
    {
      id: 1,
      name: "자산을 부탁해",
      description:
        "첫 번째 헬프를 완료했습니다. 당신의 봉사 여정이 시작되었습니다!",
      emoji: "🏦",
      isUnlocked: true,
      unlockDate: "2025-01-15",
      category: "첫 헬프",
    },
    {
      id: 2,
      name: "두근두근",
      description: "10번째 헬프를 완료했습니다. 봉사에 대한 열정이 가득합니다!",
      emoji: "💘",
      isUnlocked: true,
      unlockDate: "2025-01-20",
      category: "열정",
    },
    {
      id: 3,
      name: "청소 마스터",
      description: "청소 카테고리에서 50번의 헬프를 완료했습니다.",
      emoji: "🧹",
      isUnlocked: true,
      unlockDate: "2025-01-25",
      category: "청소",
    },
    {
      id: 4,
      name: "요리사",
      description: "요리 카테고리에서 30번의 헬프를 완료했습니다.",
      emoji: "👨‍🍳",
      isUnlocked: false,
      category: "요리",
    },
    {
      id: 5,
      name: "운전 기사",
      description: "운전 카테고리에서 20번의 헬프를 완료했습니다.",
      emoji: "🚗",
      isUnlocked: false,
      category: "운전",
    },
    {
      id: 6,
      name: "상담사",
      description: "상담 카테고리에서 25번의 헬프를 완료했습니다.",
      emoji: "💬",
      isUnlocked: false,
      category: "상담",
    },
    {
      id: 7,
      name: "환경 지킴이",
      description: "환경 관련 헬프를 100번 완료했습니다.",
      emoji: "🌱",
      isUnlocked: false,
      category: "환경",
    },
    {
      id: 8,
      name: "시간 관리자",
      description: "한 달 동안 매일 헬프를 완료했습니다.",
      emoji: "⏰",
      isUnlocked: false,
      category: "시간",
    },
    {
      id: 9,
      name: "친구 만들기",
      description: "100명의 다른 사용자와 헬프를 완료했습니다.",
      emoji: "🤝",
      isUnlocked: false,
      category: "소셜",
    },
    {
      id: 10,
      name: "평점 마스터",
      description: "평균 평점 4.8 이상을 유지했습니다.",
      emoji: "⭐",
      isUnlocked: false,
      category: "평점",
    },
    {
      id: 11,
      name: "기타 전문가",
      description: "기타 카테고리에서 40번의 헬프를 완료했습니다.",
      emoji: "🔧",
      isUnlocked: false,
      category: "기타",
    },
    {
      id: 12,
      name: "연속 달성",
      description: "7일 연속으로 헬프를 완료했습니다.",
      emoji: "🔥",
      isUnlocked: false,
      category: "연속",
    },
    {
      id: 13,
      name: "밤의 수호자",
      description: "자정 이후에도 헬프를 완료했습니다. 밤에도 봉사하는 당신!",
      emoji: "🦉",
      isUnlocked: false,
      category: "시간대",
    },
    {
      id: 14,
      name: "새벽의 기사",
      description:
        "새벽 6시 이전에 헬프를 완료했습니다. 일찍 일어나는 새벽 기사!",
      emoji: "🌅",
      isUnlocked: false,
      category: "시간대",
    },
    {
      id: 15,
      name: "주말 전사",
      description:
        "주말에만 헬프를 20번 완료했습니다. 주말을 봉사로 채우는 당신!",
      emoji: "🏆",
      isUnlocked: false,
      category: "주말",
    },
    {
      id: 16,
      name: "비의 친구",
      description:
        "비 오는 날에도 헬프를 완료했습니다. 날씨에 흔들리지 않는 의지!",
      emoji: "☔",
      isUnlocked: false,
      category: "날씨",
    },
    {
      id: 17,
      name: "더위 사냥꾼",
      description:
        "여름철 더운 날에도 헬프를 완료했습니다. 더위를 이기는 열정!",
      emoji: "🌞",
      isUnlocked: false,
      category: "날씨",
    },
    {
      id: 18,
      name: "추위 극복자",
      description:
        "겨울철 추운 날에도 헬프를 완료했습니다. 추위를 이기는 따뜻한 마음!",
      emoji: "❄️",
      isUnlocked: false,
      category: "날씨",
    },
    {
      id: 19,
      name: "지역 탐험가",
      description:
        "서로 다른 10개 지역에서 헬프를 완료했습니다. 넓은 지역을 누비는 탐험가!",
      emoji: "🗺️",
      isUnlocked: false,
      category: "지역",
    },
    {
      id: 20,
      name: "고령자 친구",
      description:
        "65세 이상 어르신과 헬프를 30번 완료했습니다. 세대 간 소통의 다리!",
      emoji: "👴",
      isUnlocked: false,
      category: "세대",
    },
    {
      id: 21,
      name: "어린이 보호자",
      description:
        "18세 미만 청소년과 헬프를 25번 완료했습니다. 미래 세대의 멘토!",
      emoji: "👶",
      isUnlocked: false,
      category: "세대",
    },
    {
      id: 22,
      name: "긴급 구조대",
      description: "긴급 헬프를 15번 완료했습니다. 언제든 달려가는 구조대원!",
      emoji: "🚨",
      isUnlocked: false,
      category: "긴급",
    },
    {
      id: 23,
      name: "환경 수호자",
      description:
        "환경 보호 관련 헬프를 50번 완료했습니다. 지구를 지키는 수호자!",
      emoji: "🌍",
      isUnlocked: false,
      category: "환경",
    },
    {
      id: 24,
      name: "동물 사랑꾼",
      description:
        "반려동물 관련 헬프를 20번 완료했습니다. 동물들의 진정한 친구!",
      emoji: "🐕",
      isUnlocked: false,
      category: "동물",
    },
  ];

  const unlockedBadges = badges.filter((badge) => badge.isUnlocked);

  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBadge(null);
  };

  return (
    <div className={styles.container}>
      {/* 나의 NEW 배지 섹션 */}
      {unlockedBadges.length > 0 && (
        <section className={styles.newBadgesSection}>
          <h2 className={styles.sectionTitle}>나의 NEW 배지</h2>
          <div className={styles.newBadgesGrid}>
            {unlockedBadges.slice(0, 2).map((badge) => (
              <div
                key={badge.id}
                className={styles.newBadgeCard}
                onClick={() => handleBadgeClick(badge)}
              >
                <div className={styles.badgeIcon}>{badge.emoji}</div>
                <p className={styles.badgeName}>{badge.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 모든 배지 섹션 */}
      <section className={styles.allBadgesSection}>
        <h2 className={styles.sectionTitle}>모든 배지</h2>
        <div className={styles.badgesGrid}>
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`${styles.badgeItem} ${
                badge.isUnlocked ? styles.unlocked : styles.locked
              }`}
              onClick={() => handleBadgeClick(badge)}
            >
              <div className={styles.badgeIcon}>{badge.emoji}</div>
              <p className={styles.badgeName}>{badge.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 모달 */}
      {isModalOpen && selectedBadge && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{selectedBadge.name}</h3>
              <button className={styles.closeButton} onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.modalBadgeIcon}>{selectedBadge.emoji}</div>
              <p className={styles.modalDescription}>
                {selectedBadge.description}
              </p>
              <div className={styles.modalInfo}>
                <span className={styles.modalCategory}>
                  카테고리: {selectedBadge.category}
                </span>
                {selectedBadge.isUnlocked && selectedBadge.unlockDate && (
                  <span className={styles.modalDate}>
                    획득일: {selectedBadge.unlockDate}
                  </span>
                )}
                <span className={styles.modalStatus}>
                  {selectedBadge.isUnlocked
                    ? "✅ 획득 완료"
                    : "🔒 아직 획득하지 못함"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchivmentPage;
