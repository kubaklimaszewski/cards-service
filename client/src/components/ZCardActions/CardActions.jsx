import { Children } from "react";
import styles from "./CardActions.module.css";

export function CardButton({ card, onAction, children }) {
  return (
    <>
      <button
        onClick={() => onAction(card)}
        className={styles.cardBtn}
      >
        {children}
      </button>
    </>
  );
}
