document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  fetch("http://localhost:3000/api/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "index.html";
        return;
      }
      return res.json();
    })
    .then((data) => {
      if (data.success) {
        fetch("http://localhost:3000/api/auth/info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
          .then((res) => {
            if (res.status === 404) {
              console.log(data.error);
              return;
            }
            return res.json();
          })
          .then((data) => {
            if (data.success) {
              document.getElementById("username").textContent = data.username;
              document.getElementById("balance").textContent = data.money;
            }
          });
      } else {
        localStorage.removeItem("token");
        window.location.href = "index.html";
      }
    })
    .catch((err) => {
      console.error(err);
      localStorage.removeItem("token");
      window.location.href = "index.html";
    });

  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });
});
