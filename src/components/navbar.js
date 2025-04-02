// src/components/Navbar.js
import { useState, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaBars,
  FaHeart,
  FaQuestionCircle,
  FaUser,
  FaShoppingCart,
  FaSearch,
} from "react-icons/fa";
import AuthContext from "../context/AuthContext";
import SidebarMenu from "./SidebarMenu";
import styles from "../styles/navbar.module.css";
import FavoritosDropdown from "./FavoritosDropdown";
import AjudaDropdown from "./AjudaDropdown";
import AreaPessoalDropdown from "./AreaPessoalDropdown";
import CarrinhoDropdown from "./CarrinhoDropdown";
import { useRouter } from "next/router";

const Navbar = () => {
  const { user } = useContext(AuthContext) || {};
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/pesquisa?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <div className={styles.notificationBar}>
        🔥 NOVOS MODELOS! NOVOS PRODUTOS! 🔥
      </div>

      <header className={styles.navbar}>
        <div className={styles.navbarContainer}>
          <div className={styles.menuIcon} onClick={() => setMenuOpen(true)}>
            <FaBars />
            <span className={styles.menuText}>menu</span>
          </div>

          <Link href="/" className={styles.logo}>
            <Image src="/logo3.png" alt="Logo" width={140} height={40} />
          </Link>

          <form onSubmit={handleSearch} className={styles.searchBar}>
            <input
              type="text"
              placeholder="Pesquisa um produto, desporto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <FaSearch className={styles.searchIcon} />
            </button>
          </form>

          <nav className={styles.icons}>
            {/* FAVORITOS */}
            <div
              className={styles.iconWrapper}
              onMouseEnter={() => setHovered("favoritos")}
              onMouseLeave={() => setHovered("")}
            >
              <FaHeart className={styles.icon} />
              <span>Favoritos</span>
              {hovered === "favoritos" && <FavoritosDropdown />}
            </div>

            {/* AJUDA */}
            <div
              className={styles.iconWrapper}
              onMouseEnter={() => setHovered("ajuda")}
              onMouseLeave={() => setHovered("")}
            >
              <FaQuestionCircle className={styles.icon} />
              <span>Ajuda</span>
              {hovered === "ajuda" && <AjudaDropdown />}
            </div>

            {/* ÁREA PESSOAL */}
            {user ? (
              <div
                className={styles.iconWrapper}
                onMouseEnter={() => setHovered("area")}
                onMouseLeave={() => setHovered("")}
              >
                <FaUser className={styles.icon} />
                <span>Área Pessoal</span>
                {hovered === "area" && <AreaPessoalDropdown />}
              </div>
            ) : (
              <Link href="/login">
                <FaUser className={styles.icon} />
                <span>Área Pessoal</span>
              </Link>
            )}

            {/* CARRINHO */}
            <div
              className={styles.iconWrapper}
              onMouseEnter={() => setHovered("carrinho")}
              onMouseLeave={() => setHovered("")}
            >
              <FaShoppingCart className={styles.icon} />
              <span>Carrinho</span>
              {hovered === "carrinho" && <CarrinhoDropdown />}
            </div>
          </nav>
        </div>
      </header>

      <SidebarMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

export default Navbar;
