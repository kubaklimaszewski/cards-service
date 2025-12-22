import styles from "./AuthHeader.module.css";

function AuthHeader({ text, description }) {
  return (
    <header className={styles.authHeader}>
      <div className={styles.authTitle}>
        <span className={styles.authTitleAccent}>CP</span>
        {text}
      </div>
      <p className={styles.authSubtitle}>
        {description}
      </p>
    </header>
  );
}

export default AuthHeader;
