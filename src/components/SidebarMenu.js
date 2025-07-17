import { useContext } from "react";
import { useRouter } from "next/router";
import AuthContext from "@/context/AuthContext";
import styles from "@/styles/SidebarMenu.module.css";

import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Plus,
  List,
  LogOut,
  HelpCircle,
  Box,
  Warehouse,
} from "lucide-react";

export default function SidebarMenu() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  // Garante que só mostra se for admin ou funcionário
  if (!user || user?.tipo_de_conta === "cliente") return null;

  const isAdmin = user?.tipo_de_conta === "admin";

  const links = isAdmin
    ? [
        { label: "Dashboard", path: "/areaAdmin", icon: <LayoutDashboard size={20} /> },
        { label: "Gestão de Produtos", path: "/admin/produtos", icon: <Box size={20} /> },
        { label: "Adicionar Produto", path: "/admin/adicprodutoadm", icon: <Plus size={20} /> },
        { label: "Gestão de Categorias", path: "/admin/categorias", icon: <List size={20} /> },
        { label: "Gerir Encomendas", path: "/admin/encomendas", icon: <ShoppingCart size={20} /> },
        { label: "Gestão de Utilizadores", path: "/admin/utilizadores", icon: <Users size={20} /> },
        { label: "Funcionários", path: "/admin/funcionarios", icon: <Users size={20} /> },
        { label: "Ver Compras", path: "/admin/compras", icon: <Package size={20} /> },
        { label: "Controle de Stock", path: "/admin/estoque", icon: <Warehouse size={20} /> },
      ]
    : [
        { label: "Dashboard", path: "/areaFuncionario", icon: <LayoutDashboard size={20} /> },
        { label: "Produtos", path: "/funcionario/produtos", icon: <Box size={20} /> },
        { label: "Compras dos Clientes", path: "/funcionario/compras", icon: <Package size={20} /> },
        { label: "Encomendas", path: "/funcionario/encomendas", icon: <ShoppingCart size={20} /> },
        { label: "Gestão de Categorias", path: "/funcionario/funccategoria", icon: <List size={20} /> },
        { label: "Controle de Stock", path: "/funcionario/CrlStock", icon: <Warehouse size={20} /> },
        { label: "Ajuda ao Cliente", path: "/funcionario/suporte", icon: <HelpCircle size={20} /> },
      ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.navMenu}>
        {links.map((link) => (
          <button
            key={link.path}
            className={`${styles.navButton} ${router.pathname === link.path ? styles.active : ""}`}
            onClick={() => router.push(link.path)}
            title={link.label}
          >
            {link.icon}
            <span className={styles.label}>{link.label}</span>
          </button>
        ))}
      </div>
      <div className={styles.logoutContainer}>
        <button className={styles.logoutButton} onClick={logout} title="Sair">
          <LogOut size={20} />
          <span className={styles.label}>Sair</span>
        </button>
      </div>
    </div>
  );
}
