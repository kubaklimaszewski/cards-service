import styles from "./DashboardHeader.module.css";

function DashboardHeader({theme, handlerTheme, handlerLogOut}) {
  return (
    <header className={styles.dashboardHeader}>
      <div className={styles.headerContent}>
        <h1 className={styles.headerTitle}>Cards Service</h1>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.themeToggle}
            onClick={handlerTheme}
            aria-label="Zmień motyw">
            {theme === "dark" ? "🌑" : "☀️"}
          </button>

          <button
            id="logout-btn"
            onClick={handlerLogOut}
            className={`${styles.btn} ${styles.btnLogout}`}>
            Wyloguj
          </button>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
