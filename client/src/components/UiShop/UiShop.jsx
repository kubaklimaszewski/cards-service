import DashboardMain from "../DashboardMain/DashboardMain";
import styles from "./UiShop.module.css";

import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

function UiShop() {
  const { handlePurchase } = useOutletContext();
  const [shopError, setShopError] = useState("");
  
  function Content() {
    const [packs, setPacks] = useState([]);

    useEffect(() => {
      const fetchShop = async () => {
        try {
          const res = await fetch("http://127.0.0.1:3000/api/shop/packs", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!res.ok) {
            const error = await res.json();
            setShopError("Błąd podczas ładowania sklepu");
            error.error.message || "Wystąpił błąd";
            console.error("Shop error:", error);
            return;
          }

          const data = await res.json();
          setPacks(data.packs);
        } catch (err) {
          console.error("Network error:", JSON.stringify(err));
          setShopError("Błąd sieci podczas ładowania sklepu");
        }
      };
      fetchShop();
    }, []);

    function handleIncrease(id) {
      setPacks((prev) =>
        prev.map((pack) =>
          pack.id === id
            ? { ...pack, quantity: Math.min(pack.quantity + 1, 25) }
            : pack
        )
      );
    }

    function handleDecrease(id) {
      setPacks((prev) =>
        prev.map((pack) =>
          pack.id === id
            ? { ...pack, quantity: Math.max(pack.quantity - 1, 1) }
            : pack
        )
      );
    }

    function handleChange(id, value) {
      value = Math.min(Math.max(value, 1), 25);

      setPacks((prev) =>
        prev.map((pack) =>
          pack.id === id ? { ...pack, quantity: value } : pack
        )
      );
    }

    return (
      <div className={styles.shopPacksGrid}>
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
                <div>Cena</div> <div>{pack.price}</div>
              </div>
            </div>

            <div className={styles.packControls}>
              <div className={styles.quantityContainer}>
                <button
                  onClick={() => handleDecrease(pack.id)}
                  className={styles.quantityBtn}
                >
                  −
                </button>
                <input
                  type="number"
                  className={styles.quantityInput}
                  value={pack.quantity}
                  min="1"
                  max="10"
                  onChange={(e) => handleChange(pack.id, e.target.value)}
                />
                <button
                  onClick={() => handleIncrease(pack.id)}
                  className={styles.quantityBtn}
                >
                  +
                </button>
              </div>
              <button
                onClick={() =>
                  handlePurchase(pack.id, pack.quantity, pack.price)
                }
                className={styles.packBtn}
              >
                Kup
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <DashboardMain
      title="Dostęne paczki"
      description="Wybierz paczkę i kup ją za swoje środki."
      error={shopError}
      content={<Content />}
    />
  );
}

export default UiShop;
