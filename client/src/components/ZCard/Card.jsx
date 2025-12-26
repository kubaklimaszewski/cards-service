import styles from "./Card.module.css";

function Card({ card, children }) {
  return (
    <>
      <div
        className={styles.card}
        data-rarity={card.rarity}
      >
        <div className={styles.cardRarityBadge}>{card.rarity}</div>
        <div className={styles.cardVisualization}>
          <div className={styles.vizPattern}></div>
          <div className={styles.vizIcon}>
            {String.fromCodePoint(card.icon)}
          </div>
        </div>

        <div className={styles.cardInfoSection}>
          <h3 className={styles.cardName}>{card.name}</h3>
          <p className={styles.cardDescription}>{card.description}</p>
        </div>

        <div className={styles.cardValueSection}>
          <div className={styles.valueBox}>
            <span className={styles.valueLabel}>Wartość</span>
            <span className={styles.cardValue}>{card.value}</span>
          </div>
          <div className={styles.valueBox}>
            <span className={styles.valueLabel}>Ilość</span>
            <span className={styles.cardValue}>{card.quantity}</span>
          </div>
        </div>

        <div className={styles.cardControls}>{children}</div>
      </div>
    </>
  );
}

export default Card;
