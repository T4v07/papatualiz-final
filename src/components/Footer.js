import React from "react";
import styles from "../styles/Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.logoContainer}>
        <img src="/logo3.png" alt="Sports ET Logo" className={styles.logo} />
      </div>
      <p className={styles.copyright}>
        © 2025 Sports ET. Todos os direitos reservados.
      </p>
    </footer>
  );
};

export default Footer;
