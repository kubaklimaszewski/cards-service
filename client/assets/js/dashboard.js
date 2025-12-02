document.addEventListener("DOMContentLoaded", () => {
  isLogged();

  let userData = localStorage.getItem("user");
  user = JSON.parse(userData);

  try {
    document.getElementById("username").textContent = user["username"];
    document.getElementById("balance").textContent = user["money"];
  } catch {
    window.location.reload();
  }
});
