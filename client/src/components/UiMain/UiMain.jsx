import DashboardMain from "../DashboardMain/DashboardMain";
import styles from "./UiMain.module.css";

function UiMain() {
  function Content() {
    return (
      <div className={styles.cardDisplay}>
        <div className={styles.cardPlaceholder}>
          <p className={styles.placeholderText}>
            Brak stałych kart do wyświetlenia
          </p>
        </div>
      </div>
    );
  }

  return (
    <DashboardMain title="tytuł" description="Opis" error="" content={<Content />} />
  )
}

export default UiMain;