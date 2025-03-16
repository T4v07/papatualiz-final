import { useState, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaBars,
  FaTimes,
  FaHeart,
  FaQuestionCircle,
  FaUser,
  FaShoppingCart,
  FaSearch,
} from "react-icons/fa";
import AuthContext from "../context/AuthContext";
import SidebarMenu from "./SidebarMenu"; // Menu lateral
import styles from "../styles/navbar.module.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext) || {};
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Pega iniciais do nome (ex: "Emanuel Tavares" => "ET")
  const getInitials = (nome = "") => {
    const parts = nome.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
    );
  };

  return (
    <>
      {/* Barra de notificação */}
      <div className={styles.notificationBar}>
        🔥 NOVOS MODELOS! NOVOS PRODUTOS! 🔥
      </div>

      <header className={styles.navbar}>
        <div className={styles.navbarContainer}>
          {/* Ícone do menu lateral (mobile) */}
          <div className={styles.menuIcon} onClick={() => setMenuOpen(true)}>
            <FaBars />
            <span className={styles.menuText}>menu</span>
          </div>

          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <Image src="/logo3.png" alt="Logo" width={140} height={40} />
          </Link>

          {/* Barra de Pesquisa */}
          <div className={styles.searchBar}>
            <input type="text" placeholder="Pesquisa um produto, desporto..." />
            <FaSearch className={styles.searchIcon} />
          </div>

          {/* Ícones de Ação */}
          <nav className={styles.icons}>
            <Link href="/favoritos">
              <FaHeart className={styles.icon} />
              <span>Favoritos</span>
            </Link>

            <Link href="/ajuda">
              <FaQuestionCircle className={styles.icon} />
              <span>Ajuda</span>
            </Link>

            {/* Área Pessoal */}
            {user ? (
              // Se o usuário está logado, exibe o "link" vertical + dropdown
              <div
                className={styles.userMenu}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <FaUser className={styles.icon} />
                <span>Área Pessoal</span>

                {/* Dropdown se estiver aberto */}
                {dropdownOpen && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      {/* Bolinha com iniciais */}
                      <div className={styles.profileCircle}>
                        {getInitials(user.nome || user.username)}
                      </div>
                      {/* Nome e email */}
                      <div className={styles.profileInfo}>
                        <strong>{user.nome || user.username}</strong>
                        <span>{user.email}</span>
                      </div>
                    </div>

                    <Link
                      href="/minhaConta"
                      onClick={() => setDropdownOpen(false)}
                      className={`${styles.dropdownItem} ${styles.editContaLink}`}
                    >
                      Editar Conta
                    </Link>


                    <hr />

                    <div
                      className={styles.dropdownItem}
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                    >
                      Logout
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Se não está logado, link para Login (igual estilo)
              <Link href="/login">
                <FaUser className={styles.icon} />
                <span>Área Pessoal</span>
              </Link>
            )}

            <Link href="/carrinho">
              <FaShoppingCart className={styles.icon} />
              <span>Carrinho</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Menu Lateral (mobile) */}
      <SidebarMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

export default Navbar;
