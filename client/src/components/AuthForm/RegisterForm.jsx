import AuthActions from "./AuthActions";
import AuthField from "./AuthField";
import styles from "./AuthForm.module.css";

function RegisterForm({
  change,
  values,
  fieldsErrors,
  isError,
  blur,
  submit,
  login,
  registerError,
}) {
  const registerFields = [
    {
      name: "username",
      text: "Nazwa użytkownika",
      placeholder: "np. Gracz123",
      type: "text",
      id: "reg-username",
    },
    {
      name: "email",
      text: "Mail",
      placeholder: "np. email@domena.pl",
      type: "email",
      id: "reg-email",
    },
    {
      name: "password",
      text: "Hasło",
      placeholder: "Twoje Hasło",
      type: "password",
      id: "reg-password",
    },
    {
      name: "passwordConfirm",
      text: "Powtórz hasło",
      placeholder: "Powtórz hasło",
      type: "password",
      id: "reg-confirm-password",
    },
  ];

  return (
    <form className={styles.authForm} onSubmit={submit}>
      {registerFields.map((field) => (
        <AuthField
          key={field.name}
          blur={blur}
          change={change}
          value={values[field.name]}
          error={fieldsErrors[field.name].message}
          fieldPlaceHolder={field.placeholder}
          fieldText={field.text}
          fieldId={field.id}
          fieldName={field.name}
          fieldType={field.type}
        />
      ))}

      <AuthActions
        isError={isError}
        error={registerError}
        action="Utwórz konto"
        description="Masz już konto?"
        nav="Zaloguj się"
        path={login}
      />
    </form>
  );
}

export default RegisterForm;
