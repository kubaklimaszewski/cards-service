document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("token")) {
    window.location.href = "dashboard.html";
  }
});

const form = document.getElementById("login-form");
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const error = document.getElementById("login-error");

  const formData = new FormData(event.target);
  const loginData = {
    email: formData.get("email").toLowerCase(),
    password: formData.get("password"),
  };

  fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        localStorage.setItem("token", data.token);
        window.location.href = "dashboard.html";
      } else {
        error.style.display = "block";
        error.textContent = data.message;
      }
    })
    .catch((error) => {
      console.error("Błąd sieci lub JS", error);
    });
});

const submit = document.querySelector('button[type="submit"]');

document.getElementById("login-email").addEventListener("change", (event) => {
  const email = event.target.value;
  const emailError = document.getElementById("login-email-error");
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
