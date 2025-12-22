import styles from "./DashboardMain.module.css";

function DashboardMain({ title, description, error, content}) {
  return (
    <main className={styles.dashboardContent}>
      <div className={styles.contentSection}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <p className={styles.sectionDescription}>{description}</p>
        <p className={styles.dashboardError}>{error}</p>
        {content}
      </div>
    </main>
  );
}

export default DashboardMain;
