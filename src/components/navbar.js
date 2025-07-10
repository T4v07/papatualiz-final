import { useState, useContext, useRef, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
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
import SidebarMenu from "./SidebarMenu";
import styles from "../styles/navbar.module.css";
import FavoritosDropdown from "./FavoritosDropdown";
import AjudaDropdown from "./AjudaDropdown";
import AreaPessoalDropdown from "./AreaPessoalDropdown";
import CarrinhoDropdown from "./CarrinhoDropdown";
import { useRouter } from "next/router";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const dropdownRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/pesquisa?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleDropdown = (nome) => {
    setActiveDropdown((prev) => (prev === nome ? "" : nome));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setActiveDropdown("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className={styles.notificationBar}>
        🔥 NOVOS MODELOS! NOVOS PRODUTOS! 🔥
      </div>

      <header className={styles.navbar}>
        <div className={styles.navbarContainer} ref={dropdownRef}>
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
            <button type="submit" className={styles.searchButton}>
              <FaSearch className={styles.searchIcon} />
            </button>
          </form>

          <nav className={styles.icons}>
            {/* FAVORITOS */}
            <div
              className={styles.iconWrapper}
              onClick={() => toggleDropdown("favoritos")}
            >
              <FaHeart className={styles.icon} />
              <span>Favoritos</span>
              {activeDropdown === "favoritos" && (
                <div className={styles.dropdownAtivo}>
                  <FavoritosDropdown />
                </div>
              )}
            </div>

            {/* AJUDA */}
            <div
              className={styles.iconWrapper}
              onClick={() => toggleDropdown("ajuda")}
            >
              <FaQuestionCircle className={styles.icon} />
              <span>Ajuda</span>
              {activeDropdown === "ajuda" && (
                <div className={styles.dropdownAtivo}>
                  <AjudaDropdown />
                </div>
              )}
            </div>

            {/* ÁREA PESSOAL */}
            {user ? (
              <div
                className={styles.iconWrapper}
                onClick={() => toggleDropdown("area")}
              >
                <FaUser className={styles.icon} />
                <span>Área Pessoal</span>
                {activeDropdown === "area" && (
                  <div className={styles.dropdownAtivo}>
                    <AreaPessoalDropdown />
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className={styles.iconWrapper}>
                <FaUser className={styles.icon} />
                <span>Área Pessoal</span>
              </Link>
            )}

            {/* CARRINHO */}
            <div
              className={styles.iconWrapper}
              onClick={() => toggleDropdown("carrinho")}
            >
              <FaShoppingCart className={styles.icon} />
              <span>Carrinho</span>
              {activeDropdown === "carrinho" && (
                <div className={styles.dropdownAtivo}>
                  <CarrinhoDropdown />
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      <SidebarMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

export default Navbar;
