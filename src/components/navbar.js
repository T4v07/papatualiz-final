import { useState, useContext, useRef, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import {
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
import SearchSuggestions from "./SearchSuggestions";
import { useRouter } from "next/router";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sugestoes, setSugestoes] = useState({ categorias: [], produtos: [] });
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/pesquisa?q=${encodeURIComponent(searchQuery)}`);
      setMostrarSugestoes(false);
    }
  };

  const toggleDropdown = (nome) => {
    setActiveDropdown((prev) => (prev === nome ? "" : nome));
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim().length >= 2) {
      try {
        const res = await fetch(`/api/sugestoes?q=${encodeURIComponent(value)}`);
        const data = await res.json();
        setSugestoes(data);
        setMostrarSugestoes(true);
      } catch (error) {
        console.error("Erro ao buscar sugestões:", error);
        setMostrarSugestoes(false);
      }
    } else {
      setMostrarSugestoes(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown("");
        setMostrarSugestoes(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const podeVerSidebar =
    user && (user.tipo_de_conta === "admin" || user.tipo_de_conta === "funcionario");

  return (
    <>
      <div className={styles.notificationBar}>
        🔥 NOVOS MODELOS! NOVOS PRODUTOS! 🔥
      </div>

      <header className={styles.navbar}>
        <div className={styles.navbarContainer} ref={dropdownRef}>
          <Link href="/" className={styles.logo}>
            <Image src="/logo3.png" alt="Logo" width={140} height={40} />
          </Link>

          <form onSubmit={handleSearch} className={styles.searchBar}>
            <input
              type="text"
              placeholder="Pesquisa um produto, desporto..."
              value={searchQuery}
              onChange={handleInputChange}
            />
            <button type="submit" className={styles.searchButton}>
              <FaSearch className={styles.searchIcon} />
            </button>
            {mostrarSugestoes && (
              <SearchSuggestions
                sugestoesPesquisa={sugestoes.sugestoesPesquisa}
                produtos={sugestoes.produtos}
                onClose={() => setMostrarSugestoes(false)}
              />
            )}

          </form>

          <nav className={styles.icons}>
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

      {podeVerSidebar && router.pathname === "/home" && (
        <SidebarMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      )}
    </>
  );
};

export default Navbar;
