import Logo from "./Logo/Logo";
import AppNav from "./AppNav/AppNav";
import styles from "./SideBar.module.css";
import { Outlet } from "react-router-dom";

function SideBar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />

      <Outlet />

      <footer className={styles.footer}>
        <p className={styles.copyRight}>
          &copy; Copyright {new Date().getFullYear()} Your Company. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}

export default SideBar;
