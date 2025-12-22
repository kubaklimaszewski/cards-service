import { useOutletContext } from "react-router-dom";
import DashboardMain from "../DashboardMain/DashboardMain";
import styles from "./UiCards.module.css";

import { useState, useEffect } from "react";

function UiCards() {
  const [cardsError, setCardsError] = useState("");

  function Content() {
    const [cards, setCards] = useState([]);
    const { handleSell } = useOutletContext();

    useEffect(() => {
      const fetchCards = async () => {
        try {
          const res = await fetch("http://127.0.0.1:3000/api/cards", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          if (!res.ok) {
            const error = await res.json();
            setCardsError("Błąd podczas ładowania kart");
            error.error.message || "Wystąpił błąd";
            console.error("Cards error:", error);
            return;
          }

          const data = await res.json();
          setCards(data.data);
        } catch (err) {
          console.error("Network error:", JSON.stringify(err));
          setCardsError("Błąd sieci podczas ładowania kart");
        }
      };
      fetchCards();
    }, []);

    async function handleCardSell(id) {
      const result = await handleSell(id);

      if (!result) return;
      
      await alert("Sprzedano kartę za " + result.value);
      setCards((prev) =>
        prev.map((card) =>
          card.id === id ? { ...card, quantity: result.newQuantity } : card
        )
      );
    }

    return (
      <div className={styles.cardsGrid}>
        {cards.filter(card => card.quantity > 0).map((card) => (
          <div key={card.id} className={styles.card} data-rarity={card.rarity}>
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

            <div className={styles.cardControls}>
              <button onClick={() => handleCardSell(card.id)} className={styles.cardBtn}>Sprzedaj</button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <DashboardMain
      title="Twoje karty"
      description="Przeglądaj swoje karty."
      error={cardsError}
      content={<Content />}
    />
  );
}

export default UiCards;
