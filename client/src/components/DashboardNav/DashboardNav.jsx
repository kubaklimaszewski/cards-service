import { NavLink } from "react-router-dom";
import styles from "./DashboardNav.module.css";

function DashboardNav() {
  const links = [
    { text: "Główna", path: "/dashboard" },
    { text: "Sklep", path: "/dashboard/shop" },
    { text: "Paczki", path: "/dashboard/packs" },
    { text: "Karty", path: "/dashboard/cards" },
  ];

  return (
    <nav className={styles.dashboardNav}>
      {links.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ""}`
          }
          end={link.path === "/dashboard"}
        >
          <span className={styles.linkLabel}>{link.text}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default DashboardNav;
