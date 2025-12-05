if (localStorage.getItem('token')) {
  window.location.href = './dashboard.html';
}

const inputs = document.querySelectorAll("#register-form input");
const submitBtn = document.getElementById("submit");

const emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+$/;
const usernameRegex = /^[A-Za-z0-9]{3,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const errors = {
  email: true,        
  username: true,
  password: true,
  passwordConfirm: true,
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
        document.getElementById("reg-email-error").textContent =
          "Wprowadź poprawny email";
        errors.email = true;
      } else {
        document.getElementById("reg-email-error").textContent = "";
        errors.email = false;
      }
    }

    if (name === "username") {
      const normalized = value.trim();
      if (!usernameRegex.test(normalized)) {
        document.getElementById("reg-username-error").textContent =
          "Wprowadź poprawną nazwe";
        errors.username = true;
      } else {
        document.getElementById("reg-username-error").textContent = "";
        errors.username = false;
      }
    }

    if (name === "password") {
      if (!passwordRegex.test(value)) {
        document.getElementById("reg-password-error").textContent =
          "Wprowadź poprawne hasło";
        errors.password = true;
      } else {
        document.getElementById("reg-password-error").textContent = "";
        errors.password = false;
      }
    }

    if (name === "passwordConfirm") {
      if (value !== document.getElementById("reg-password").value) {
        document.getElementById("reg-password-confirm-error").textContent =
          "Powtórz hasło";
        errors.passwordConfirm = true;
      } else {
        document.getElementById("reg-password-confirm-error").textContent = "";
        errors.passwordConfirm = false;
      }
    }

    updateSubmitState();
  });
});


const form = document.getElementById("register-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const payload = {
    username: formData.get("username").trim(),
    email: formData.get("email").trim().toLowerCase(),
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
  };

  tr  y {
    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });


    if (!res.ok) {
      const error = await res.json();
      document.getElementById("register-error").textContent =
        error.error.message || "Wystąpił błąd";
      console.error("Registration error:", error);
      return;
    }

    const data = await res.json();
    console.log("Registered:", data);
    window.location.href = "./index.html";
  } catch (err) {
    console.error("Network error: ", JSON.stringify(err));
  }
});
