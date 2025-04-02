import { useContext } from "react";
import AuthContext from "../../context/AuthContext"; // IMPORTAÇÃO CORRETA: default
import { useRouter } from "next/router";
import styles from "../../styles/admin.module.css";

export default function SidebarAdmin() {
  const { user } = useContext(AuthContext); // FUNCIONA COM O DEFAULT EXPORT
  const router = useRouter();

  const links = [
    { label: "Dashboard", path: "/areaAdmin" },
    { label: "Gestão de Produtos", path: "/admin/produtos" },
    { label: "Gestão de Categorias", path: "/admin/categorias" },
    { label: "Gestão de Utilizadores", path: "/admin/utilizadores" },
    { label: "Ver Compras", path: "/admin/compras" },
    { label: "Controle de Estoque", path: "/admin/estoque" },
  ];

  const handleNavigate = (path) => {
    router.push(path);
  };

  return (
    <div className={styles.sidebar}>
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
  );
}
