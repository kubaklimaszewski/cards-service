const submit = document.querySelector('button[type="submit"]');

const form = document.getElementById("register-form");
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const error = document.getElementById("register-error");

  const formData = new FormData(event.target);
  const registerData = {
    username: formData.get("username"),
    email: formData.get("email").toLowerCase(),
    password: formData.get("password"),
    confirmPassword: formData.get("passwordConfirm"),
  };
  fetch("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerData),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        window.location.href = "index.html";
      } else {
        error.style.display = "block";
        error.textContent = data.message;
      }
    })
    .catch((error) => {
      console.error("Błąd sieci lub JS", error);
    });
});

document.getElementById("reg-username").addEventListener("change", (event) => {
  const username = event.target.value;
  const usernameError = document.getElementById("reg-username-error");
  const usernamePattern = /^[a-zA-Z0-9]+$/;
  if (!usernamePattern.test(username)) {
    usernameError.textContent =
      "Wprowadź poprawną nazwę (tylko litery i cyfry)";
    submit.disabled = true;
  } else if (username.length < 3) {
    usernameError.textContent = "Nazwa musi mieć conajmniej 3 znaki";
    submit.disabled = true;
  } else {
    usernameError.textContent = "";
    submit.disabled = false;
  }
});

document.getElementById("reg-email").addEventListener("change", (event) => {
  const email = event.target.value;
  const emailError = document.getElementById("reg-email-error");
  const emailPattern =
    /^[a-zA-Z][a-zA-Z0-9]*(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]{2,}\.[a-zA-Z]+$/;
  if (!emailPattern.test(email)) {
    emailError.textContent = "Wprowadź poprawny email";
    submit.disabled = true;
  } else {
    emailError.textContent = "";
    submit.disabled = false;
  }
});

document.getElementById("reg-password").addEventListener("change", (event) => {
  const password = event.target.value;
  const passwordError = document.getElementById("reg-password-error");
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\-*\.#]{8,}$/;
  if (!passwordPattern.test(password)) {
    passwordError.textContent =
      "Wprowadź poprawne hasło (co najmniej 8 znaków, po jednej dużej i małej literze oraz cyfrze)";
    submit.disabled = true;
  } else {
    passwordError.textContent = "";
    submit.disabled = false;
  }
});

document
  .getElementById("reg-password-confirm")
  .addEventListener("change", (event) => {
    const password = event.target.value;
    const passwordError = document.getElementById("reg-password-confirm-error");
    if (password != document.getElementById("reg-password").value) {
      passwordError.textContent = "Powtórz hasło";
      submit.disabled = true;
    } else {
      passwordError.textContent = "";
      submit.disabled = false;
    }
  });
