document.addEventListener("DOMContentLoaded", () => {
  isLogged();

  const user = JSON.parse(localStorage.getItem("user"));

  try {
    document.getElementById("username").textContent = user["username"];
    document.getElementById("balance").textContent = user["money"];
  } catch {
    window.location.reload();
  }
});
