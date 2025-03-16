import React, { useState } from "react";
import styles from "../styles/SidebarMenu.module.css";

const SidebarMenu = ({ isOpen, onClose }) => {
  const [activeMenu, setActiveMenu] = useState(null);

  const menus = {
    main: [
      { title: "DESPORTOS", submenu: "desportos" },
      { title: "HOMEM", submenu: "homem" },
      { title: "MULHER", submenu: "mulher" },
      { title: "ACESSÓRIOS", submenu: "acessorios" },
    ],
    desportos: [
      { title: "CICLISMO" },
      { title: "CAMINHADA NA NATUREZA" },
      { title: "CAMPISMO" },
      { title: "FITNESS" },
      { title: "FUTEBOL" },
      { title: "CORRIDA" },
    ],
    homem: [
      { title: "ROUPA HOMEM" },
      { title: "CALÇADO HOMEM" },
    ],
    mulher: [
      { title: "ROUPA MULHER" },
      { title: "CALÇADO MULHER" },
    ],
    acessorios: [
      { title: "MOCHILAS E SACOS" },
      { title: "ACESSÓRIOS ELETRÔNICOS DE TREINO" },
    ],
  };

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <div className={styles.menuHeader}>
        {activeMenu ? (
          <button className={styles.backButton} onClick={() => setActiveMenu(null)}>
            &lt; VOLTAR
          </button>
        ) : (
          <button className={styles.closeButton} onClick={onClose}>
            ✖
          </button>
        )}
      </div>

      <ul className={styles.menuList}>
        {(activeMenu ? menus[activeMenu] : menus.main).map((item, index) => (
          <li
            key={index}
            className={styles.menuItem}
            onClick={() => item.submenu && setActiveMenu(item.submenu)}
          >
            {item.title}
            {item.submenu && <span className={styles.arrow}>&gt;</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarMenu;
