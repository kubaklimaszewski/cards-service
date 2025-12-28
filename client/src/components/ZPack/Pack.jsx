import styles from "./Pack.module.css";

export function Pack({ pack, label, children, active }) {
  return (
    <>
      <div
        className={`${styles.packCard} ${active ? styles.active : ""}`}
        data-rarity={pack.rarity}
      >
        {/* <div className={styles.packRarityBadge}>{pack.rarity}</div> */}
        <div className={styles.packVisualization}>
          <div className={styles.vizPattern}></div>
          <div className={styles.vizIcon}>
            {String.fromCodePoint(pack.icon)}
          </div>
        </div>

        <div className={styles.packInfoSection}>
          <h3 className={styles.packName}>{pack.name}</h3>
          <p className={styles.packDescription}>{pack.description}</p>
          <p className={styles.packDescription}>
            Liczba kart: {pack.cards_count}
          </p>
        </div>

        {label && (
          <div className={styles.packPriceSection}>
            <div className={styles.packPrice}>
              <div>{label}</div>{" "}
              <div>{pack.price * pack.quantity || pack.quantity}</div>
            </div>
          </div>
        )}
        <div className={styles.packControls}>{children}</div>
      </div>
    </>
  );
}