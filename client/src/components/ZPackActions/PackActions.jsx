import { Children } from "react";
import styles from "./PackActions.module.css";

export function ShopAction({
  pack,
  active,
  onChange,
  onIncrease,
  onDecrease,
  onAction,
  max,
  children,
}) {
  return (
    <>
      <div className={styles.quantityContainer}>
        <button
          onClick={() => onDecrease(pack.id)}
          className={styles.quantityBtn}
          disabled={!active}
        >
          −
        </button>
        <input
          disabled={!active}
          type="number"
          className={styles.quantityInput}
          min="1"
          max={max}
          value={pack.quantity}
          onChange={(e) =>
            onChange(pack.id, e.target.value, Number(e.target.max))
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") onAction(pack.id, pack.quantity, pack.price);
          }}
        />
        <button
          onClick={() => onIncrease(pack.id, max)}
          className={styles.quantityBtn}
          disabled={!active}
        >
          +
        </button>
      </div>
      <button
        onClick={() => onAction(pack.id, pack.quantity, pack.price)}
        disabled={!active}
        className={`${styles.packBtn} ${active ? styles.active : ""}`}
      >
        {children}
      </button>
    </>
  );
}

export function PackAction({ pack, active, onAction, children }) {
  return (
    <>
      <button
        onClick={() => onAction(pack)}
        disabled={!active}
        className={`${styles.packBtn} ${active ? styles.active : ""}`}
      >
        {children} 
      </button>
    </>
  );
}
