import { useOutletContext } from "react-router-dom";
import DashboardMain from "../DashboardMain/DashboardMain";
import styles from "./UiPacks.module.css";

import { useState, useEffect } from "react";

function UiPacks() {
  const [packError, setPackError] = useState("");

  function Content() {
    const [packs, setPacks] = useState([]);
    const { handleOpen } = useOutletContext();

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

    async function handlePackOpen(id) {
      const result = await handleOpen(id);

      if (!result) return;

      setPacks((prev) =>
        prev
          .map((pack) =>
            pack.id === id ? { ...pack, quantity: result.newQuantity } : pack
          )
          .filter((pack) => pack.quantity > 0)
      );
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
              <div
                key={pack.id}
                className={styles.packCard}
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

                <div className={styles.packPriceSection}>
                  <div className={styles.packPrice}>
                    <div>Ilość</div> <div>{pack.quantity}</div>
                  </div>
                </div>

                <div className={styles.packControls}>
                  <button
                    onClick={() => handlePackOpen(pack.id, pack.quantity)}
                    className={styles.packBtn}
                  >
                    Otwórz
                  </button>
                </div>
              </div>
            ))}
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
