import AuthHeader from "../components/AuthHeader/AuthHeader";
import RegisterForm from "../components/AuthForm/RegisterForm";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const USERNAME_REGEX = /^[A-Za-z0-9]{3,}$/;
const EMAIL_REGEX = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

function RegisterPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/dashboard");
  }, [navigate]);

  const [registerError, setRegisterError] = useState("");
  const [values, setValue] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [fieldsErrors, setFieldError] = useState({
    username: { error: true, message: "" },
    email: { error: true, message: "" },
    password: { error: true, message: "" },
    passwordConfirm: { error: true, message: "" },
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setValue((v) => ({
      ...v,
      [name]: value,
    }));
  }

  function handleBlur(e) {
    const { name, value } = e.target;

    if (name === "username") {
      if (!USERNAME_REGEX.test(value)) {
        setFieldError((v) => ({
          ...v,
          [name]: { error: true, message: "Podaj poprawną nazwę" },
        }));
      } else {
        setFieldError((v) => ({
          ...v,
          [name]: { error: false, message: "" },
        }));
      }
    }

    if (name === "email") {
      if (!EMAIL_REGEX.test(value)) {
        setFieldError((v) => ({
          ...v,
          [name]: { error: true, message: "Podaj poprawny email" },
        }));
      } else {
        setFieldError((v) => ({
          ...v,
          [name]: { error: false, message: "" },
        }));
      }
    }

    if (name === "password") {
      if (!PASSWORD_REGEX.test(value)) {
        setFieldError((v) => ({
          ...v,
          [name]: {
            error: true,
            message:
              "Podaj poprawne hasło (min. 8 znaków, 1 mała i duża litera oraz cyfra",
          },
        }));
      } else {
        setFieldError((v) => ({
          ...v,
          [name]: { error: false, message: "" },
        }));
      }
    }

    if (name === "passwordConfirm") {
      if (value !== values.password) {
        setFieldError((v) => ({
          ...v,
          [name]: {
            error: true,
            message: "Powtórz hasło",
          },
        }));
      } else {
        setFieldError((v) => ({
          ...v,
          [name]: { error: false, message: "" },
        }));
      }
    }
  }

  const isError =
    fieldsErrors.email.error ||
    fieldsErrors.password.error ||
    fieldsErrors.passwordConfirm.error ||
    fieldsErrors.username.error;

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const error = await res.json();
        setRegisterError(error.error.message || "Wystąpił błąd");
        console.error("Registration error:", error);
        return;
      }

      const data = await res.json();
      console.log("Registered:", data);
      navigate("/login");
    } catch (err) {
      console.error("Network error: ", JSON.stringify(err));
    }
  }

  function handleLogin() {
    navigate("/login");
  }

  return (
    <div className="authPage">
      <main className="authCard">
        <div className="authCardInner">
          <AuthHeader
            text="Rejestracja"
            description="Utwórz konto i zacznij otwierać paczki z kartami."
          />

          <RegisterForm
            change={handleChange}
            blur={handleBlur}
            submit={handleSubmit}
            login={handleLogin}
            values={values}
            fieldsErrors={fieldsErrors}
            isError={isError}
            registerError={registerError}
          />
        </div>
      </main>
    </div>
  );
}

export default RegisterPage;
