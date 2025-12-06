document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://127.0.0.1:3000/api/shop/packs", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      document.getElementById("shop-error").textContent =
        "Nie udało się załadować sklepu";
      error.error.message || "Wystąpił błąd";
      console.error("Shop error:", error);
      return;
    }

    const data = await res.json();
    console.log(data.packs);
    data.packs.forEach((pack) => {
      const div = document.createElement("div");
      div.classList.add("pack-card");
      div.dataset.rarity = pack.rarity;
      div.dataset.id = pack.id;

      div.innerHTML = `
        <div class="pack-rarity-badge">Zwykła</div>
          <div class="pack-visualization">
          <div class="viz-pattern"></div>
          <div class="viz-icon">${pack.icon}</div>
        </div>
        <div class="pack-info-section">
          <h3 class="pack-name">${pack.name}</h3>
          <p class="pack-description">${pack.description}</p>
        </div>
        <div class="pack-price-section">
          <div class="pack-price">${pack.price}<span class="pack-currency"> zł</span></div>
        </div>
        <div class="pack-controls">
          <div class="quantity-container">
            <button class="quantity-btn" data-action="dec">−</button>
            <input type="number" class="quantity-input" value="1" min="1" max="10" />
            <button class="quantity-btn" data-action="inc">+</button>
          </div>
          <button class="btn-buy">Kup</button>
        </div>
      `;

      const input = div.querySelector(".quantity-input");
      const btns = div.querySelectorAll(".quantity-btn");
      const buyBtn = div.querySelector(".btn-buy");

      input.addEventListener("change", () => {
        if (input.value < 0) {
          input.value = 0;
        } else if (input.value > 10) {
          input.value = 10;
        }
      });

      btns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const action = btn.dataset.action;
          const current = Number(input.value);
          const min = Number(input.min);
          const max = Number(input.max);

          if (action === "inc" && current < max) input.value = current + 1;
          if (action === "dec" && current > min) input.value = current - 1;
        });
      });

      buyBtn.addEventListener("click", async () => {
        const quantity = Number(input.value);
        if (
          quantity * pack.price <=
          Number(document.getElementById("balance").textContent)
        ) {
          console.log("Kup paczkę", pack.id, "x", quantity);
          const res = await fetch(
            `http://127.0.0.1:3000/api/shop/packs/${pack.id}/purchase`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({ quantity: quantity }),
            }
          );

          if (!res.ok) {
            const error = await res.json();
            console.error("Purchase error:", error);
            return;
          }

          const data = await res.json();
          console.log("Zakupiono paczki");
          document.getElementById("balance").textContent = data.newBalance;
        }
      });

      document.getElementById("shop-packs-grid").append(div);
    });
  } catch (err) {
    console.error("Network error:", JSON.stringify(err));
    document.getElementById("shop-error").textContent =
      "Błąd sieci podczas ładowania sklepu";
  }
});
