import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import styles from "../styles/minhaContaSidebarMelhorada.module.css";
import { useRouter } from "next/router";

const SidebarConta = ({ active }) => {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  const getInitial = (nome = "") => nome.charAt(0).toUpperCase();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.perfil}>
        <div className={styles.avatar}>
          {user?.Nome ? getInitial(user.Nome) : "?"}
        </div>
        <div className={styles.info}>
          <h3>{user?.Nome || "Usuário"}</h3>
          <p>{user?.Email || ""}</p>
        </div>
      </div>

      <nav className={styles.menu}>
        <button className={active === "compras" ? styles.ativo : ""} onClick={() => router.push("/minhasCompras")}>
          🛒 Minhas Compras
        </button>
        <button className={active === "favoritos" ? styles.ativo : ""} onClick={() => router.push("/favoritos")}>
          ❤️ Favoritos
        </button>
        <button className={active === "encomendas" ? styles.ativo : ""} onClick={() => router.push("/minhasEncomendas")}>
          📦 Encomendas
        </button>
        <button className={active === "conta" ? styles.ativo : ""} onClick={() => router.push("/minhaConta")}>
          ⚙️ Gerir Conta
        </button>
        <button className={styles.logout} onClick={logout}>🚪 Sair</button>
      </nav>
    </aside>
  );
};

export default SidebarConta;
