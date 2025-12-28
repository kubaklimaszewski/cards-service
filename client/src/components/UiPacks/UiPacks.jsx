import { useOutletContext } from "react-router-dom";
import DashboardMain from "../DashboardMain/DashboardMain";
import styles from "./UiPacks.module.css";
import { Pack } from "../ZPack/Pack";

import { useState, useEffect } from "react";
import { PackAction } from "../ZPackActions/PackActions";
import { Spinner } from "../ZzElements/Elements";
import { Card } from "../ZCard/Card";
import { CardButton } from "../ZCardActions/CardActions";

function UiPacks() {
  const [packError, setPackError] = useState("");

  function Content() {
    const [packs, setPacks] = useState([]);
    const [cards, setCards] = useState(null);
    const { handleOpen, handleSell, handleSellAll } = useOutletContext();
    const [openingPack, setOpeningPack] = useState(0);
    const opening = openingPack !== 0;

    useEffect(() => {
      const fetchPacks = async () => {
        try {
          const res = await fetch("http://127.0.0.1:3000/api/packs", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          if (!res.ok) {
            const error = await res.json();
            setPackError("Błąd podczas ładowania paczek");
            error.error.message || "Wystąpił błąd";
            console.error("Pack error:", error);
            return;
          }

          const data = await res.json();
          if (data.data) {
            setPacks(data.data);
          }
        } catch (err) {
          console.error("Network error:", JSON.stringify(err));
          setPackError("Błąd sieci podczas ładowania paczek");
        }
      };
      fetchPacks();
    }, []);

    async function handlePackOpen(pack) {
      setOpeningPack(pack.id);
      const result = await handleOpen(pack.id);

      if (!result) {
        alert("Błąd otwierania paczki");
        setOpeningPack(0);
        return;
      }

      setCards(
        result.cards
          .map((card, index) => ({
            ...card,
            tempId: index,
          }))
          .sort((a, b) => b.value - a.value)
      );

      console.log(cards);

      setPacks((prev) =>
        prev
          .map((packp) =>
            packp.id === pack.id
              ? { ...packp, quantity: result.newQuantity }
              : packp
          )
          .filter((packp) => packp.quantity > 0)
      );
    }

    async function handleCardSell(c) {
      const result = await handleSell(c.id);

      if (!result) return;

      setCards((prev) => {
        const newCards = prev.filter((card) => card.tempId !== c.tempId);

        if (newCards.length === 0) {
          setOpeningPack(0);
        }

        return newCards;
      });
    }

    async function handleSellAllCards() {
      const cardsID = cards.map((card) => card.id);
      try {
        const result = await handleSellAll(cardsID); 

        if (result) {
          setCards([]);
          setOpeningPack(0); 
        }
      } catch (error) {
        console.error("Błąd sprzedaży:", error);
      }
    }

    function handleClose(e) {
      if (e.target === e.currentTarget) {
        setOpeningPack(0);
        setCards([]);
      }
    }

    return (
      <>
        {packs.length === 0 ? (
          <div className={styles.packDisplay}>
            <div className={styles.packPlaceholder}>
              <p className={styles.placeholderText}>
                Brak paczek do wyświetlenia
              </p>
            </div>
          </div>
        ) : (
          <div className={styles.packsGrid}>
            {packs.map((pack) => (
              <Pack key={pack.id} pack={pack} label="Ilość" active={!opening}>
                <PackAction
                  active={!opening}
                  pack={pack}
                  onAction={handlePackOpen}
                >
                  {openingPack === pack.id ? (
                    <>
                      Otwieram <Spinner />
                    </>
                  ) : (
                    "Otwórz"
                  )}
                </PackAction>
              </Pack>
            ))}
          </div>
        )}
        {opening && cards && cards.length > 0 && (
          <div className={styles.overlay} onClick={handleClose}>
            <div className={styles.dropContainer}>
              <div
                className={
                  cards.length <= 5 ? styles.dropGrid : styles.dropGrid6
                }
              >
                {cards &&
                  cards.map((card, index) => (
                    <div key={index + 1} className={styles.card}>
                      <Card card={card} type="packs">
                        <CardButton card={card} onAction={handleCardSell}>
                          Sprzedaj
                        </CardButton>
                      </Card>
                    </div>
                  ))}
              </div>
              <div className={styles.dropActions}>
                {cards.length > 1 && (<button onClick={handleSellAllCards} className={styles.btn}>
                  Sprzedaj wszystko
                </button>)}
                <button onClick={handleClose} className={styles.btn}>
                  Zamknij
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <DashboardMain
      title="Twoje paczki"
      description="Wybierz paczkę i otwórz ją."
      error={packError}
      content={<Content />}
    />
  );
}

export default UiPacks;
