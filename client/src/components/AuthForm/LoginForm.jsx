import AuthActions from "./AuthActions";
import AuthField from "./AuthField";
import styles from "./AuthForm.module.css";

function LoginForm({
  change,
  values,
  fieldsErrors,
  isError,
  blur,
  submit,
  register,
  loginError,
}) {

    const registerFields = [
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
        error={loginError}
        action="Zaloguj się"
        description="Nie masz jeszcze konta?"
        nav="Utwórz konto"
        path={register}
      />
    </form>
  );
}

export default LoginForm;
