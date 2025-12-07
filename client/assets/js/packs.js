document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://127.0.0.1:3000/api/packs", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      document.getElementById("packs-error").textContent =
        "Nie udało się załadować paczek";
      error.error.message || "Wystąpił błąd";
      console.error("Packs error:", error);
      return;
    }
    const data = await res.json();
    const packs = data.data;
    console.log(packs);
    packs.forEach((pack) => {
      const div = document.createElement("div");
      div.classList.add("pack-card");
      div.dataset.rarity = pack.rarity;
      div.dataset.id = pack.id;

      div.innerHTML = `
        <div class="pack-rarity-badge">${pack.rarity}</div>
          <div class="pack-visualization">
          <div class="viz-pattern"></div>
          <div class="viz-icon">${pack.icon}</div>
        </div>
        <div class="pack-info-section">
          <h3 class="pack-name">${pack.name}</h3>
          <p class="pack-description">${pack.description}</p>
          <p class="pack-description">Liczba kart: ${pack.cards_count}</p>
        </div>
        <div class="pack-price-section">
          <div class="pack-price"><div>Ilość</div> <div class="quantity">${pack.quantity}</div></div>
        </div>
        <div class="pack-controls">
          <button class="pack-btn">Otwórz</button>
        </div>
      `;

      const openBtn = div.querySelector(".pack-btn");

      openBtn.addEventListener("click", async () => {
        openBtn.disabled = true;
        const res = await fetch(
          `http://127.0.0.1:3000/api/packs/${pack.id}/open`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!res.ok) {
          const error = await res.json();
          console.error("Open error:", error);
          openBtn.disabled = false;
          return;
        }

        const data2 = await res.json();
        const openedPack = data2.data;
        if (openedPack.newQuantity === 0) {
          div.remove();
        }

        div.querySelector(".quantity").textContent = openedPack.newQuantity;
        alert("Paczkę otworzono! Sprawdź ekwipunek.");
        openBtn.disabled = false;
      });

      document.getElementById("packs-grid").append(div);
    });
  } catch (err) {
    console.error("Network error:", JSON.stringify(err));
    document.getElementById("packs-error").textContent =
      "Błąd sieci podczas ładowania sklepu";
  }
});
