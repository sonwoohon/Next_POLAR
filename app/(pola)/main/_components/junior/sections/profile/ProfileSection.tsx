import styles from './ProfileSection.module.css';
import ProfileBanner from '@/app/_components/ProfileBanner';

export default function ProfileSection() {
  return (
    <div className={styles.profileBanner}>
      <ProfileBanner />
    </div>
  );
} 