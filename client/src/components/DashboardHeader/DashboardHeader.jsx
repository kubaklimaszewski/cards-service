import styles from "./DashboardHeader.module.css";

function DashboardHeader({theme, handleTheme, handleLogOut}) {
  return (
    <header className={styles.dashboardHeader}>
      <div className={styles.headerContent}>
        <h1 className={styles.headerTitle}>Cards Service</h1>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.themeToggle}
            onClick={handleTheme}
            aria-label="Zmień motyw">
            {theme === "dark" ? "🌑" : "☀️"}
          </button>

          <button
            id="logout-btn"
            onClick={handleLogOut}
            className={`${styles.btn} ${styles.btnLogout}`}>
            Wyloguj
          </button>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
