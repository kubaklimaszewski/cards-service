import DashboardMain from "../DashboardMain/DashboardMain";
import {Pack} from "../ZPack/Pack";
import { PackAction, ShopAction } from "../ZPackActions/PackActions";
import styles from "./UiShop.module.css";

import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

function UiShop() {
  const {
    handlePurchase,
    handlePurchaseBP,
    handleClaimPack,
    isClaimed,
    bpQuantity,
  } = useOutletContext();
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

    function handleIncrease(id, max) {
      setPacks((prev) =>
        prev.map((pack) =>
          pack.id === id
            ? { ...pack, quantity: Math.min(pack.quantity + 1, max) }
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

    function handleChange(id, value, max) {
      value = Math.min(Math.max(value, 1), max);

      setPacks((prev) =>
        prev.map((pack) =>
          pack.id === id ? { ...pack, quantity: value } : pack
        )
      );
    }

    return (
      <>
        <div className={styles.wrapper}>
          <h2 className={styles.title}>Paczki</h2>
          <div className={styles.shopPacksGrid}>
            {packs[0] && (
              <Pack pack={packs[0]} label="Cena" active={bpQuantity > 0}>
                <ShopAction
                  pack={packs[0]}
                  active={bpQuantity > 0}
                  quantitySection={true}
                  onChange={handleChange}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  onAction={handlePurchaseBP}
                  max={bpQuantity}
                >
                  Kup {bpQuantity}/5
                </ShopAction>
              </Pack>
            )}
            {packs
              .filter((pack) => pack.id !== 1)
              .map((pack) => (
                <Pack key={pack.id} pack={pack} label="Cena" active={true}>
                  <ShopAction
                    pack={pack}
                    active={true}
                    onChange={handleChange}
                    onIncrease={handleIncrease}
                    onDecrease={handleDecrease}
                    onAction={handlePurchase}
                    max={25}
                  >
                    Kup
                  </ShopAction>
                </Pack>
              ))}
          </div>
        </div>

        {packs[0] && (
          <div className={styles.wrapper}>
            <h2 className={styles.title}>Codzienna paczka</h2>
            <div className={styles.shopPacksGrid}>
              <Pack pack={packs[0]} active={!isClaimed}>
                <PackAction pack={packs[0]} active={!isClaimed} onAction={handleClaimPack}>
                  {isClaimed ? "Odebrano" : "Odbierz"}
                </PackAction>
              </Pack>
            </div>
          </div>
        )}
      </>
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
