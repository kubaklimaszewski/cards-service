import styles from "./AuthForm.module.css";

function AuthActions({ isError, error, action, description, nav, path }) {
  return (
    <div className={styles.authActions}>
      <button type="submit" disabled={isError} className={styles.authButton}>
        {action}
      </button>

      <p className={styles.authError}>{error}</p>

      <div className={styles.authSecondary}>
        <span>{description}</span>
        <a onClick={path} className={styles.authLink}>{nav}</a>
      </div>
    </div>
  );
}

export default AuthActions;
