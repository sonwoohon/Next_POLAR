'use client';
import { useState } from 'react';
import styles from './Footer.module.css';
import Link from 'next/link';

const Footer: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string>('');

  const handleMenuClick = (menuName: string) => {
    setActiveMenu(menuName);
  };

  return (
    <footer className={styles.footer}>
      <nav>
        <ul className={styles.menuList}>
          <li className={activeMenu === 'helps' ? styles.active : ''}>
            <Link 
              href="/helps" 
              onClick={() => handleMenuClick('helps')}
            >
              헬프메인
            </Link>
          </li>
          <li className={activeMenu === 'hall-of-fame' ? styles.active : ''}>
            <Link 
            href="/user/hall-of-fame"  
              onClick={() => handleMenuClick('hall-of-fame')}
            >
              명예의 전당
            </Link>
          </li>
          <li className={activeMenu === 'home' ? styles.active : ''}>
            <Link 
              href="/main" 
              onClick={() => handleMenuClick('home')}
            >
              홈
            </Link>
          </li>
          <li className={activeMenu === 'profile' ? styles.active : ''}>
            <Link 
              href="/user/profile/me" 
              onClick={() => handleMenuClick('profile')}
            >
              마이페이지
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer; 