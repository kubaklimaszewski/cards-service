import DashboardMain from "../DashboardMain/DashboardMain";
import styles from "./UiPacks.module.css";

import { useState, useEffect } from "react";

function UiPacks() {
  const [packError, setPackError] = useState("");

  function Content() {
    const [packs, setPacks] = useState([]);

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
          setPacks(data.data);
        } catch (err) {
          console.error("Network error:", JSON.stringify(err));
          setPackError("Błąd sieci podczas ładowania paczek");
        }
      };
      fetchPacks();
    }, []);

    async function handleOpen(id) {
      try {
        const res = await fetch(`http://127.0.0.1:3000/api/packs/${id}/open`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          const error = await res.json();
          console.log("Pack error:", error);
          return;
        }

        const data = await res.json();
        console.log(data.data.cards);
        setPacks((prev) =>
          prev.map((pack) =>
            pack.id === id ? { ...pack, quantity: data.data.newQuantity } : pack
          )
        );
      } catch (err) {
        console.error("Network error:", JSON.stringify(err));
      }
    }

    return (
      <div className={styles.PacksGrid}>
        {packs
          .filter((pack) => pack.quantity > 0)
          .map((pack) => (
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
                  onClick={() => handleOpen(pack.id, pack.quantity)}
                  className={styles.packBtn}
                >
                  Otwórz
                </button>
              </div>
            </div>
          ))}
      </div>
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
