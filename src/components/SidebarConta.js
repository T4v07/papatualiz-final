import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import styles from "../styles/minhaConta.module.css";
import { useRouter } from "next/router";

const SidebarConta = ({ active }) => {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  const getInitial = (nome = "") => nome.charAt(0).toUpperCase();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.profileSection}>
        <div className={styles.profileCircle}>
          {user?.nome ? getInitial(user.nome) : "?"}
        </div>
        <h3>{user?.nome || "Usuário"}</h3>
        <p className={styles.email}>{user?.email}</p>
      </div>
      <nav className={styles.navMenu}>
        <button className={active === "compras" ? styles.active : ""} onClick={() => router.push("/minhasCompras")}>
          As minhas compras
        </button>
        <button className={active === "favoritos" ? styles.active : ""} onClick={() => router.push("/favoritos")}>
          Favoritos
        </button>
        <button className={active === "conta" ? styles.active : ""} onClick={() => router.push("/minhaConta")}>
          Gerir a minha conta
        </button>
        <button className={styles.logoutBtn} onClick={logout}>
          Sair
        </button>
      </nav>
    </aside>
  );
};

export default SidebarConta;
