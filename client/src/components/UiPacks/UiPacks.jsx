import { useOutletContext } from "react-router-dom";
import DashboardMain from "../DashboardMain/DashboardMain";
import styles from "./UiPacks.module.css";
import Pack from "../ZPack/Pack";

import { useState, useEffect } from "react";
import { PackAction } from "../ZPackActions/PackActions";

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
              <Pack key={pack.id} pack={pack} label="Ilość" active={true}>
                <PackAction active={true} pack={pack} onAction={handlePackOpen}>Otwórz</PackAction>
              </Pack>
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
