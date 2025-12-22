import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UiMain from "./components/UiMain/UiMain";
import UiShop from "./components/UiShop/UiShop";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import UiPacks from "./components/UiPacks/UiPacks";
import UiCards from "./components/UiCards/UiCards";

function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  function handlerTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={<DashboardPage theme={theme} handlerTheme={handlerTheme} />}
        >
          <Route index element={<UiMain />} />
          <Route path="shop" element={<UiShop />} />
          <Route path="packs" element={<UiPacks />} />
          <Route path="cards" element={<UiCards />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
