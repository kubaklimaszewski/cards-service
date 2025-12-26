import { Children } from "react";
import styles from "./CardActions.module.css";

export function CardButton({ id, onAction, children }) {
  return (
    <>
      <button
        onClick={() => onAction(id)}
        className={styles.cardBtn}
      >
        {children}
      </button>
    </>
  );
}
