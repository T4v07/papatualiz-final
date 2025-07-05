import React from "react";
import styles from "../styles/Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.columns}>
          <div>
            <h3>A Sports ET</h3>
            <ul>
              <li>A empresa</li>
              <li>Recrutamento</li>
              <li>Sustentabilidade</li>
            </ul>
          </div>

          <div>
            <h3>Serviços</h3>
            <ul>
              <li>Clube Sports ET</li>
              <li>Cartão Presente</li>
              <li>Personalização</li>
              <li>Reparações</li>
            </ul>
          </div>

          <div>
            <h3>Ajuda</h3>
            <ul>
              <li>FAQs</li>
              <li>Contactos</li>
              <li>Devoluções</li>
              <li>Garantias</li>
            </ul>
          </div>

          <div>
            <h3>Segue-nos</h3>
            <div className={styles.socials}>
              <a href="#"><img src="https://res.cloudinary.com/dk56q7rsl/image/upload/v1751139237/icons8-facebook_1_o8atvt.svg" alt="Facebook" /></a>
              <a href="#"><img src="https://res.cloudinary.com/dk56q7rsl/image/upload/v1751139237/icons8-instagram_1_yt0qij.svg" alt="Instagram" /></a>
              <a href="#"><img src="https://res.cloudinary.com/dk56q7rsl/image/upload/v1751139238/icons8-youtube_1_vshjgu.svg" alt="YouTube" /></a>
              <a href="#"><img src="https://res.cloudinary.com/dk56q7rsl/image/upload/v1751139238/icons8-linkedin_2_gb3bj1.svg" alt="LinkedIn" /></a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <img src="/logo3.png" alt="Logo Sports ET" />
          <p>© 2025 Sports ET. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
