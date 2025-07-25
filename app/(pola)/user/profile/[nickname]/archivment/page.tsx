'use client';
import { useState } from 'react';
import styles from './archivment.module.css';
import { BADGES, type Badge } from '@/lib/constants/badges';

const ArchivmentPage: React.FC = () => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const unlockedBadges = BADGES.filter((badge) => badge.isUnlocked);

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
          {BADGES.map((badge) => (
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
                    ? '✅ 획득 완료'
                    : '🔒 아직 획득하지 못함'}
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
