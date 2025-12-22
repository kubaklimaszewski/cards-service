import AuthHeader from "../components/AuthHeader/AuthHeader";
import LoginForm from "../components/AuthForm/LoginForm";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EMAIL_REGEX = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/dashboard");
  }, [navigate]);

  const [loginError, setLoginError] = useState("");
  const [values, setValue] = useState({ email: "", password: "" });
  const [fieldsErrors, setFieldError] = useState({
    email: { error: true, message: "" },
    password: { error: true, message: "" },
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
  }

  const isError = fieldsErrors.email.error || fieldsErrors.password.error;

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const error = await res.json();
        setLoginError(error.error.message || "Wystąpił błąd");
        console.error("Login error:", error);
        return;
      }

      const data = await res.json();
      console.log("Logged:", data);
      localStorage.setItem("token", data.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Network error: ", JSON.stringify(err));
    }
  }

  function handleRegister() {
    navigate("/register");
  }

  return (
    <div className="authPage">
      <main className="authCard">
        <div className="authCardInner">
          <AuthHeader
            text="logowanie"
            description="Wejdź do swojego konta i zacznij otwierać paczki z kartami."
          />

          <LoginForm
            change={handleChange}
            blur={handleBlur}
            submit={handleSubmit}
            register={handleRegister}
            values={values}
            fieldsErrors={fieldsErrors}
            isError={isError}
            loginError={loginError}
          />
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
