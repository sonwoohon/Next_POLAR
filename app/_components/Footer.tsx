import React from 'react';
import styles from './Footer.module.css';
import { FaHandsHelping, FaMedal, FaHome, FaUserCircle } from 'react-icons/fa';
import Link from 'next/link';

const Footer: React.FC = () => {
return (
    <footer className={styles.footer}>
    <nav>
        <ul className={styles.menuList}>
        <li>
            <Link href="/helps">
            <FaHandsHelping className={styles.icon} />
            <span>헬프메인</span>
            </Link>
        </li>
        <li>
            <Link href="/main/junior/hall-of-fame">
            <FaMedal className={styles.icon} />
            <span>명예의 전당</span>
            </Link>
        </li>
        <li>
            <Link href="/">
            <FaHome className={styles.icon} />
            <span>홈</span>
            </Link>
        </li>
        <li>
            <Link href="/user/profile/me">
            <FaUserCircle className={styles.icon} />
            <span>마이페이지</span>
            </Link>
        </li>
        </ul>
    </nav>
    </footer>
);
};

export default Footer; 