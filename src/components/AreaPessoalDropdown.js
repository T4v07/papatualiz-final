import Link from "next/link";
import { useContext } from "react";
import { useRouter } from "next/router";
import AuthContext from "@/context/AuthContext";
import styles from "../styles/dropdowns.module.css";

const AreaPessoalDropdown = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const router = useRouter();

  if (loading) return null; // ou spinner

  const getInitials = (nome = "") => {
    const parts = nome.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
    );
  };

  const handleLogout = () => {
    logout();          // chama a função logout do contexto
    router.push("/login");  // redireciona para login
  };

  return (
    <div className={styles.dropdownAtivo}>
      <div className={styles.dropdownBox}>
        <div className={styles.seta}></div>
        <div className={styles.userInfo}>
          <div className={styles.userCircle}>{getInitials(user?.nome || "")}</div>
          <div className={styles.userText}>
            <p className={styles.nome}>{user?.nome || "Utilizador"}</p>
            <p className={styles.email}>{user?.email || "email@exemplo.com"}</p>
          </div>
        </div>
        <hr className={styles.separator} />
        <Link href="/minhasCompras" className={styles.linkItem}>As minhas compras</Link>
        <Link href="/favoritos" className={styles.linkItem}>Favoritos</Link>
        <Link href="/minhaConta" className={styles.linkItem}>Gerir a minha conta</Link>
        <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default AreaPessoalDropdown;
