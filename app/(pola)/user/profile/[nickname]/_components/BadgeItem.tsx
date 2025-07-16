import React from "react";
import styles from "./BadgeItem.module.css";

interface BadgeItemProps {
  icon: string;
  tooltip: string;
  isFirst?: boolean;
  isLast?: boolean;
}

const BadgeItem: React.FC<BadgeItemProps> = ({
  icon,
  tooltip,
  isFirst,
  isLast,
}) => {
  return (
    <div
      className={
        styles.badgeItem +
        (isFirst ? " " + styles.first : "") +
        (isLast ? " " + styles.last : "")
      }
    >
      {icon}
      <div className={styles.badgeTooltip}>{tooltip}</div>
    </div>
  );
};

export default BadgeItem;
