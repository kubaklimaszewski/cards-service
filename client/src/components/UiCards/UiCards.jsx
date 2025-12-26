import { useOutletContext } from "react-router-dom";
import DashboardMain from "../DashboardMain/DashboardMain";
import Card from "../ZCard/Card";
import styles from "./UiCards.module.css";

import { useState, useEffect, useMemo } from "react";
import { CardButton } from "../ZCardActions/CardActions";

function UiCards() {
  const [cardsError, setCardsError] = useState("");

  function Content() {
    const [cards, setCards] = useState([]);
    const [rarityFilter, setRarityFilter] = useState("all");
    const [raritySort, setRaritySort] = useState("none");
    const [searchFilter, setSearchFilter] = useState("");
    const { handleSell, handlesellDuplicate } = useOutletContext();

    const rarities = ["common", "rare", "epic", "legendary", "mythic"];

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
          if (data.data) {
            setCards(data.data);
          }
        } catch (err) {
          console.error("Network error:", JSON.stringify(err));
          setCardsError("Błąd sieci podczas ładowania kart");
        }
      };
      fetchCards();
    }, []);

    const filteredCards = useMemo(() => {
      let result = [...cards];

      if (searchFilter.trim()) {
        const term = searchFilter.toLowerCase().trim();
        result = result.filter((card) =>
          card.name.toLowerCase().includes(term)
        );
      }

      if (rarityFilter !== "all") {
        result = result.filter((card) => card.rarity === rarityFilter);
      } else {
        const rarityOrder = {
          mythic: 5,
          legendary: 4,
          epic: 3,
          rare: 2,
          common: 1,
        };

        result.sort((a, b) => {
          const aRarity = rarityOrder[a.rarity];
          const bRarity = rarityOrder[b.rarity];

          return raritySort === "none" ? aRarity - bRarity : bRarity - aRarity;
        });
      }

      return result;
    }, [rarityFilter, cards, raritySort, searchFilter]);

    async function handleCardSell(id) {
      const result = await handleSell(id);

      if (!result) return;

      setCards((prev) =>
        prev
          .map((card) =>
            card.id === id ? { ...card, quantity: result.newQuantity } : card
          )
          .filter((card) => card.quantity > 0)
      );
    }

    async function handleCardsSell(id) {
      const result = await handlesellDuplicate(id);

      if (!result) return;

      setCards((prev) =>
        prev.map((card) =>
          card.id === id ? { ...card, quantity: result.newQuantity } : card
        )
      );
    }

    return (
      <>
        {cards.length === 0 ? (
          <div className={styles.cardDisplay}>
            <div className={styles.cardPlaceholder}>
              <p className={styles.placeholderText}>
                Brak kart do wyświetlenia
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.controls}>
              {/* Sortowanie */}
              <div className={styles.controlGroup}>
                <label className={styles.controlLabel}>Sortuj</label>
                <div className={styles.sortToggle}>
                  <button
                    className={`${styles.sortBtn} ${
                      raritySort !== "none" ? styles.active : ""
                    }`}
                    onClick={() =>
                      setRaritySort(raritySort === "none" ? "reverse" : "none")
                    }
                  >
                    {raritySort === "none" ? "▼" : "▲"}
                  </button>
                </div>
              </div>

              {/* Wyszukiwarka */}
              <div className={styles.controlGroup}>
                <label className={styles.controlLabel}>Szukaj</label>
                <div className={styles.searchWrapper}>
                  <input
                    className={styles.searchInput}
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Wpisz nazwę karty..."
                    type="text"
                  />
                  {searchFilter && (
                    <button
                      className={styles.clearBtn}
                      onClick={() => setSearchFilter("")}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Filtry rarity */}
              <div className={styles.controlGroup}>
                <label className={styles.controlLabel}>Rzadkość</label>
                <div className={styles.rarityToggle}>
                  {rarities.map((rarity) => (
                    <button
                      key={rarity}
                      className={`${styles.rarityBtn} ${styles[rarity]} ${
                        rarityFilter === rarity ? styles.active : ""
                      }`}
                      data-rarity={rarity}
                      onClick={() =>
                        setRarityFilter(
                          rarityFilter === rarity ? "all" : rarity
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.cardsGrid}>
              {filteredCards.map((card) => (
                <Card key={card.id} card={card}>
                    <CardButton id={card.id} onAction={handleCardSell}>Sprzedaj</CardButton>
                    <CardButton id={card.id} onAction={handleCardsSell}>Sprzedaj duplikaty</CardButton>
                </Card>
              ))}
            </div>
          </>
        )}
      </>
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
