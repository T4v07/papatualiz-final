import React from "react";
import styles from "../styles/Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.innerFooter}>
        <img src="/logo3.png" alt="Sports ET Logo" className={styles.logo} />
        <p className={styles.copyright}>
          © 2025 Sports ET. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
