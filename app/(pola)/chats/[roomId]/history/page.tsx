import styles from './History.module.css';

export default function ChatHistoryPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.logo}>POLAR</span>
        <span className={styles.spacer}></span>
        <span className={styles.bell}>🔔</span>
      </header>
      <div className={styles.topBar}>
        <span className={styles.back}>{'<'} </span>
        <span className={styles.title}>이전 help 기록</span>
      </div>
      <div className={styles.profileBox}>
        <div className={styles.profileImg}></div>
        <div className={styles.profileInfo}>
          <div className={styles.profileName}>무슨무슨 시니어</div>
          <div className={styles.profileRating}>
            <span className={styles.stars}>★★★★★</span>
            <span className={styles.ratingNum}>(31개)</span>
          </div>
        </div>
      </div>
      <div className={styles.helpList}>
        {[1, 2].map((item) => (
          <div className={styles.helpCard} key={item}>
            <div className={styles.helpTextWrap}>
              <div className={styles.helpTitle}>
                수해 피해 복구가 필요해요 글자는 여기까지나와요.
                두줄까지만보여요
              </div>
              <div className={styles.helpDate}>
                2025.07.04(금) ~ 2025.07.06(일)
              </div>
              <div className={styles.helpTag}>
                <span>💪 무거워요</span>
              </div>
            </div>
            <div className={styles.helpRight}>
              <img className={styles.helpImg} src='/help-img.jpg' alt='help' />
              <div className={styles.helpPoint}>150,000점</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
