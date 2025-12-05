if (localStorage.getItem("token")) {
  window.location.href = "./dashboard.html";
}

const inputs = document.querySelectorAll("#login-form input");
const submitBtn = document.getElementById("submit");

const emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const errors = {
  email: true,
  password: true,
};

function updateSubmitState() {
  const hasError = Object.values(errors).some((val) => val === true);
  submitBtn.disabled = hasError;
}

inputs.forEach((input) => {
  input.addEventListener("change", () => {
    const { name, value } = input;

    if (name === "email") {
      const normalized = value.trim().toLowerCase();
      if (!emailRegex.test(normalized)) {
        document.getElementById("login-email-error").textContent =
          "Wprowadź poprawny email";
        errors.email = true;
      } else {
        document.getElementById("login-email-error").textContent = "";
        errors.email = false;
      }
    }

    if (name === "password") {
      if (!passwordRegex.test(value)) {
        document.getElementById("login-password-error").textContent =
          "Wprowadź poprawne hasło";
        errors.password = true;
      } else {
        document.getElementById("login-password-error").textContent = "";
        errors.password = false;
      }
    }

    updateSubmitState();
  });
});

const form = document.getElementById("login-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const payload = {
    email: formData.get("email").trim().toLowerCase(),
    password: formData.get("password"),
  };

  try {
    const res = await fetch("http://127.0.0.1:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json();
      document.getElementById("login-error").textContent =
        error.error.message || "Wystąpił błąd"
      console.error("Login error:", error);
      return;
    }

    const data = await res.json();
    console.log("Registered:", data);
    localStorage.setItem('token', data.data.token);
    window.location.href = "./dashboard.html";
  } catch (err) {
    console.error("Network error: ", JSON.stringify(err));
  }
});
