document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "./index.html";
  }
  try {
    const res = await fetch("http://127.0.0.1:3000/api/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      localStorage.removeItem("token");
      window.location.href = "./index.html";
      return;
    }

    const data = await res.json();
    document.getElementById("username").textContent = data.username;
    document.getElementById("balance").textContent = data.balance;
  } catch (err) {
    localStorage.removeItem("token");
    window.location.href = "./index.html"
    console.error("Network error:", JSON.stringify(err));
  }
});

document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "./index.html";
});
