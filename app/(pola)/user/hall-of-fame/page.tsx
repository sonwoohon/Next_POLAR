'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useHallOfFameRanking } from '@/lib/hooks/useGetRanking';
import styles from './Ranking.module.css';

export default function JuniorHallOffamePage() {
  const [skipAnimation, setSkipAnimation] = useState(false);

  const {
    data: ranking = [],
    isLoading: loading,
    error,
  } = useHallOfFameRanking(1);

  return (
    <div
      className={
        styles.rankingWrap + (skipAnimation ? ' ' + styles.skipAnim : '')
      }
    >
      <h1 className={`${styles.neon} ${styles.hallTitle} ${styles.neonFlash}`}>
        명예의 <span>전당</span>
      </h1>
      <div className={styles.rankingTopWrap}>
        <div className={styles.verticalLighting}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <ul>
          {ranking.slice(0, 3).map((item) => (
            <li key={item.nickname}>
              <div className={styles.imgwrap}>
                <Image
                  src={item.profileImg}
                  alt='프로필 이미지'
                  width={80}
                  height={80}
                />
              </div>
              <span className={styles.rankingTopScore}>
                {item.totalScore.toLocaleString()}
              </span>
              <span className={styles.rankingTopName}>{item.nickname}</span>
              <span className={styles.categoryLabel}>{item.category}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.rankingBtmWrap}>
        {loading ? (
          <p>로딩 중...</p>
        ) : error ? (
          <p className={styles.error}>
            점수를 불러오는 중 오류가 발생했습니다.
          </p>
        ) : (
          <ul>
            {ranking.slice(3, 10).map((item, idx) => (
              <li key={item.nickname} className={styles.rankingBtmItem}>
                <div className={styles.rankingBtmImgContainer}>
                  <Image
                    src={item.profileImg}
                    alt='프로필 이미지'
                    className={styles.rankingBtmImg}
                    width={40}
                    height={40}
                  />
                  <span className={styles.rankingBtmRank}>{idx + 4}</span>
                  <span className={styles.rankingBtmName}>{item.nickname}</span>
                </div>
                <div className={styles.rankingBtmAmount}>
                  <span className={styles.categoryLabel}>{item.category}</span>
                  <span>{item.totalScore.toLocaleString()}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={styles.curtain}>
        <div className={styles.curtainItemLeft}>
          <Image
            src='/images/ranking/curtain_left.png'
            alt='커튼 왼쪽'
            width={200}
            height={400}
          />
        </div>
        <div className={styles.curtainItemright}>
          <Image
            src='/images/ranking/curtain_right.png'
            alt='커튼 오른쪽'
            width={200}
            height={400}
          />
        </div>
      </div>
      <div className={styles.circleLights}></div>
      {!skipAnimation && (
        <button
          className={styles.skipBtn}
          onClick={() => setSkipAnimation(true)}
        >
          애니메이션 스킵
        </button>
      )}
    </div>
  );
}
