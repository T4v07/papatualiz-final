// components/admin/SidebarAdmin.js
import { useContext } from "react";
import { useRouter } from "next/router";
import AuthContext from "@/context/AuthContext";
import styles from "@/styles/admin.module.css";

export default function SidebarAdmin() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  const links = [
    { label: "Dashboard", path: "/areaAdmin" },
    { label: "Gestão de Produtos", path: "/admin/produtos" },
    { label: "Adicionar Produto", path: "/admin/adicprodutoadm" },
    { label: "Gestão de Categorias", path: "/admin/categorias" },
    { label: "Gerir Encomendas", path: "/admin/encomendas" },
    { label: "Gestão de Utilizadores", path: "/admin/utilizadores" },
    { label: "Funcionários", path: "/admin/funcionarios" },
    { label: "Ver Compras", path: "/admin/compras" },
    { label: "Controle de Stock", path: "/admin/estoque" },
    { label: "Home", path: "/home" },
  ];

  const handleNavigate = (path) => {
    router.push(path);
  };

  return (
    <div className={styles.sidebar}>
      <div>
        <div className={styles.profile}>
          <div className={styles.initials}>
            {user?.Nome?.[0]?.toUpperCase() || "A"}
          </div>
          <div>
            <h4>{user?.Nome || "Administrador"}</h4>
            <p>{user?.Email || "admin@example.com"}</p>
          </div>
        </div>

        <div className={styles.navMenu}>
          {links.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavigate(link.path)}
              className={router.pathname === link.path ? styles.active : ""}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.logoutContainer}>
        <button onClick={logout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </div>
  );
}
