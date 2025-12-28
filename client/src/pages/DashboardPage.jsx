import DashboardHeader from "../components/DashboardHeader/DashboardHeader";
import DashboardNav from "../components/DashboardNav/DashboardNav";
import DashboardUserInfo from "../components/DashboardUserInfo/DashboardUserInfo";
import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";

function DashboardPage({ theme, handleTheme }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [isClaimed, setIsClaimed] = useState(false);
  const [bpQuantity, setBpQuantity] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
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
          navigate("/login");
          return;
        }

        const data = await res.json();
        setUser({
          name: data.username,
          balance: data.balance,
          cards: data.cards,
        });
        setIsClaimed(data.isClaimed);
        setBpQuantity(data.bpQuantity);
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/login");
        console.error("Network error:", JSON.stringify(err));
      }
    };

    fetchUser();
  }, [navigate]);

  function handleLogOut() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  async function handlePurchase(id, quantity, price) {
    try {
      if (user.balance < quantity * price) {
        return;
      }
      const res = await fetch(
        `http://127.0.0.1:3000/api/shop/packs/${id}/purchase`,
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
        error.error.message || "Wystąpił błąd";
        console.error("Shop error:", error);
        return;
      }

      const data = await res.json();
      alert("Zakupiono paczki.");
      setUser((prev) => ({ ...prev, balance: data.newBalance }));
    } catch (err) {
      console.error("Network error:", JSON.stringify(err));
    }
  }

  async function handlePurchaseBP(id, quantity, price) {
    try {
      if (user.balance < quantity * price) {
        return;
      }
      const res = await fetch(
        `http://127.0.0.1:3000/api/shop/packs/purchase/basicPack`,
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
        error.error.message || "Wystąpił błąd";
        console.error("Shop error:", error);
        return;
      }

      const data = await res.json();
      alert("Zakupiono paczki.");
      setUser((prev) => ({ ...prev, balance: data.newBalance }));
      setBpQuantity(data.newBP);
    } catch (err) {
      console.error("Network error:", JSON.stringify(err));
    }
  }

  async function handleClaimPack(pack) {
    try {
      const res = await fetch(
        `http://127.0.0.1:3000/api/shop/packs/${pack.id}/claim`,
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
        error.error.message || "Wystąpił błąd";
        console.error("Claim error:", error);
        return;
      }

      const data = await res.json();
      if (pack.id === 1) {
        setIsClaimed(true);
      }
      alert("Odebrano paczkę.");
    } catch (err) {
      console.error("Network error:", JSON.stringify(err));
    }
  }

  async function handleSell(id) {
    try {
      const res = await fetch(`http://127.0.0.1:3000/api/cards/${id}/sell`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Card sell error:", error);
        return;
      }

      const data = await res.json();
      console.log(data);
      setUser((prev) => ({
        ...prev,
        balance: data.data.newBalance,
        cards: data.data.cards,
      }));
      return data.data;
    } catch (err) {
      console.error("Network error:", JSON.stringify(err));
    }
  }

  async function handlesellDuplicate(id) {
    try {
      const res = await fetch(
        `http://127.0.0.1:3000/api/cards/${id}/sell/duplicate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const error = await res.json();
        console.error("Card sell error:", error);
        return;
      }

      const data = await res.json();
      console.log(data);
      setUser((prev) => ({
        ...prev,
        balance: data.data.newBalance,
        cards: data.data.cards,
      }));
      return data.data;
    } catch (err) {
      console.error("Network error:", JSON.stringify(err));
    }
  }

  async function handleSellAll(ids) {
    try {
      const res = await fetch("http://127.0.0.1:3000/api/cards/sell/all", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: ids }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Card sell error:", error);
        return;
      }

      const data = await res.json();
      setUser((prev) => ({
        ...prev,
        balance: data.data.newBalance,
        cards: data.data.cards,
      }));
      return data.data;
    } catch (err) {
      console.error("Network error:", JSON.stringify(err));
    }
  }

  async function handleOpen(id) {
    try {
      const res = await fetch(`http://127.0.0.1:3000/api/packs/${id}/open`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        console.log("Pack error:", error);
        return;
      }

      const data = await res.json();
      setUser((prev) => ({ ...prev, cards: data.data.cardsNumber }));

      return data.data;
    } catch (err) {
      console.error("Network error:", JSON.stringify(err));
    }
  }

  return (
    <div className="dashboardContainer">
      <DashboardHeader
        theme={theme}
        handleTheme={handleTheme}
        handleLogOut={handleLogOut}
      />

      <DashboardUserInfo user={user} />

      <DashboardNav />

      <Outlet
        context={{
          handlePurchase,
          handlePurchaseBP,
          handleOpen,
          handleSell,
          handlesellDuplicate,
          handleSellAll,
          isClaimed,
          bpQuantity,
          handleClaimPack,
        }}
      />
    </div>
  );
}
export default DashboardPage;
