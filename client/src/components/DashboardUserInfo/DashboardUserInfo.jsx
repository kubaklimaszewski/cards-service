import styles from "./DashboardUserInfo.module.css";

function DashboardUserInfo({ user }) {
  return (
    <section className={styles.userInfoSection}>
      <div className={styles.userInfoCard}>
        <div className={styles.userInfoItem}>
          <span className={styles.userInfoLabel}>Użytkownizk</span>
          <span className={styles.userInfoValue}>{user.name}</span>
        </div>
        <div className={styles.userInfoItem}>
          <span className={styles.userInfoLabel}>Saldo</span>
          <span className={`${styles.userInfoValue} ${styles.accent}`}>
            {user.balance}
          </span>
        </div>
        <div className={styles.userInfoItem}>
          <span className={styles.userInfoLabel}>Karty</span>
          <span className={styles.userInfoValue}>42</span>
        </div>
      </div>
    </section>
  );
}

export default DashboardUserInfo;
