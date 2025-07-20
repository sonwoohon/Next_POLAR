'use client';
import { useFooterNavigation } from '@/lib/hooks/footer/useFooterNavigation';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const { activeMenu, slidePosition, handleMenuClick, menuItems } = useFooterNavigation();

  return (
    <footer className={styles.footer}>
      <nav className={styles.nav}>
        <ul className={styles.menuList}>
          {menuItems.map((item) => (
            <li key={item.name} className={activeMenu === item.name ? styles.active : ''}>
              <button 
                onClick={() => handleMenuClick(item.name, item.path, item.position)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        {/* 슬라이드 배경 */}
        <div 
          className={styles.slideBackground}
          style={{ left: `${slidePosition * 25}%` }}
        />
      </nav>
    </footer>
  );
};

export default Footer; 