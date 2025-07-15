  // components/funcionario/SidebarFuncionario.js
import { useContext } from "react";
import { useRouter } from "next/router";
import AuthContext from "@/context/AuthContext";
import styles from "@/styles/admin.module.css"; // usa o mesmo CSS do admin

export default function SidebarFuncionario() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  const links = [
    { label: "Dashboard", path: "/areaFuncionario" },
    { label: "Produtos", path: "/funcionario/produtos" },
    { label: "Compras dos Clientes", path: "/funcionario/compras" },
    { label: "Encomendas", path: "/funcionario/encomendas" },
    { label: "Gestão de Categorias", path: "/funcionario/funccategoria" },
    { label: "Controle de Stock", path: "/funcionario/CrlStock" },
    { label: "Ajuda ao Cliente", path: "/funcionario/suporte" },
  ];

  const handleNavigate = (path) => {
    router.push(path);
  };

  return (
    <div className={styles.sidebar}>
      <div>
        <div className={styles.profile}>
          <div className={styles.initials}>
            {user?.Nome?.[0]?.toUpperCase() || "F"}
          </div>
          <div>
            <h4>{user?.Nome || "Funcionário"}</h4>
            <p>{user?.Email || "func@example.com"}</p>
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
        <button className={styles.logoutButton} onClick={logout}>
          Sair
        </button>
      </div>
    </div>
  );
}
