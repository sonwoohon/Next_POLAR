import styles from './TabSection.module.css';

interface TabSectionProps {
  onCategoryClick: () => void;
  onCalendarClick: () => void;
}

export default function TabSection({ onCategoryClick, onCalendarClick }: TabSectionProps) {
  return (
    <div className={styles.buttonContainer}>
      <button className={styles.tabButton} onClick={onCategoryClick}>카테고리</button>
      <button className={styles.tabButton} onClick={onCalendarClick}>캘린더</button>
    </div>
  );
} 