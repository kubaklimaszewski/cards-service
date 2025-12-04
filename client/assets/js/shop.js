document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/api/packs/load", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        const packs = data.packs;
        const container = document.getElementById("shop-packs-grid");
        packs.forEach((pack) => {
          const article = document.createElement("article");
          article.classList.add("pack-card");
          article.innerHTML = `
            <div class="pack-card-header">
              <h3 class="pack-name">${pack.name} Pack</h3>
              <span class="pack-rarity-tag rarity-common">Common</span>
            </div>
            <p class="pack-description">
              Podstawowa paczka kart – dobry wybór na start.
            </p>
            <ul class="pack-meta">
              <li>5 kart w paczce</li>
              <li>Szansa na rzadką kartę: 10%</li>
            </ul>
            <div class="pack-footer">
              <div class="pack-price">
                <span class="price-label">Cena</span>
                <span class="price-value">${pack.price}</span>
              </div>
              <button
                class="btn btn-pack-buy"
                data-pack-price="${pack.price}"
                data-pack-id="${pack.id}"
              >
                Kup paczkę
              </button>
            </div>
          `;
          container.appendChild(article);
        });

        //Dodawanie nasłuchiwaczy na przyciski
        //Wywalić wszystkie user zamienic na id zwracane z authMiddleware
        document.querySelectorAll(".btn-pack-buy").forEach((btn) => {
          btn.addEventListener("click", () => {
            const packId = btn.dataset.packId;

            fetch("http://localhost:3000/api/packs/buy", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ packId: packId }),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.success) {
                  document.getElementById("balance").textContent = data.newMoney;
                }
              })
              .catch((error) => {
                console.error("Błąd sieci lub JS", error);
              });
          });
        });
      }
    })
    .catch((error) => {
      console.error("Błąd", error);
    });
});
