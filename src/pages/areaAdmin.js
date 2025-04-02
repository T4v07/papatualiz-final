// src/pages/areaAdmin.js
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import AuthContext from "../context/AuthContext";
import SidebarAdmin from "../components/admin/SidebarAdmin"; // Importa o SidebarAdmin
import AdminDashboard from "../components/admin/AdminDashboard"; // Dashboard do Admin
import styles from "../styles/admin.module.css";

export default function AreaAdmin() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.Tipo_de_Conta !== "admin") {
      router.push("/servicosLogin");
    }
  }, [user]);

  return (
    <div className={styles.adminContainer}>
      <SidebarAdmin /> {/* Sidebar no layout */}

      <main className={styles.mainContent}>
        <AdminDashboard /> {/* Exibe a Dashboard */}
      </main>
    </div>
  );
}
