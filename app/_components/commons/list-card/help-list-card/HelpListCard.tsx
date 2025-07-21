"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./HelpListCard.module.css";
import CategoryBadge from "@/app/_components/category-badge/CategoryBadge";
import type { HelpListResponseDto } from "@/backend/helps/applications/dtos/HelpDTO";

interface HelpListCardProps {
  help: HelpListResponseDto;
}

const getRewardByCategory = (category: { id: number; point: number }[]) => {
  const total = category.reduce((sum, cur) => sum + cur.point, 0);
  return `${total.toLocaleString()}점`;
};

const getStatusText = (status: string) => {
  switch (status) {
    case "open":
      return "모집중";
    case "connecting":
      return "연결중";
    case "completed":
      return "완료";
    case "close":
      return "취소됨";
    default:
      return status;
  }
};

const HelpListCard: React.FC<HelpListCardProps> = ({ help }) => {
  const router = useRouter();
  const { seniorInfo, title, startDate, endDate, category, status, images } =
    help;

  // 날짜 포맷
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return `${d.getFullYear()}.${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}.${d.getDate().toString().padStart(2, "0")}`;
  };

  const handleClick = () => {
    router.push(`/helps/${help.id}`);
  };

  return (
    <div
      className={styles.cardLink}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className={styles.card}>
        <div className={styles.thumbnail}>
          <Image
            src={images?.[0] || "/images/dummies/dummy_user.png"}
            alt="썸네일"
            width={100}
            height={100}
            className={styles.thumbnailImg}
            style={{ objectFit: "cover", borderRadius: "0.8rem" }}
            priority={true}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/dummies/dummy_user.png";
            }}
          />
        </div>
        <div className={styles.info}>
          <div className={styles.topRow}>
            <div className={styles.categoryContainer}>
              {category.slice(0, 2).map((cate) => {
                return <CategoryBadge key={cate.id} category={cate.id} />;
              })}
              {category.length > 2 && (
                <span className={styles.moreCategories}>
                  +{category.length - 2}
                </span>
              )}
            </div>
            <span className={styles.status}>{getStatusText(status)}</span>
          </div>
          <div className={styles.title}>{title}</div>
          <div className={styles.subInfo}>
            <span className={styles.nickname}>
              {seniorInfo.name || seniorInfo.nickname}
            </span>
            <span className={styles.date}>
              {formatDate(startDate)} ~ {formatDate(endDate)}
            </span>
            <span className={styles.reward}>
              {getRewardByCategory(category)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpListCard;
