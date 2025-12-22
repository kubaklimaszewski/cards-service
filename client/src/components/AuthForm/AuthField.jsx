import styles from "./AuthForm.module.css";

function LoginField({ change, value, fieldId, fieldName, fieldText, fieldPlaceHolder, error, blur, fieldType }) {
  return (
    <div className={styles.authField}>
      <label className={styles.authLabel} htmlFor={fieldId}>
        {fieldText}
      </label>
      <div className={styles.authInputWrapper}>
        <input
          value={value}
          onBlur={blur}
          onChange={change}
          id={fieldId}
          name={fieldName}
          className={styles.authInput}
          type={fieldType}
          placeholder={fieldPlaceHolder}
          required
        />
      </div>
      <div className={styles.authError}>{error}</div>
    </div>
  );
}

export default LoginField;
