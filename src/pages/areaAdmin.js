// src/pages/areaAdmin.js
import { useContext, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import { useRouter } from "next/router";
import SidebarAdmin from "@/components/admin/SidebarAdmin"; // Importa o SidebarAdmin
import AdminDashboard from "@/components/admin/AdminDashboard"; // Dashboard do Admin
import styles from "@/styles/admin.module.css";

export default function AreaAdmin() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || user.tipo_de_conta !== "admin") {
        router.push("/servicosLogin");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!user || user.tipo_de_conta !== "admin") {
    return null; // evita renderizar o conteúdo antes do redirecionamento
  }

  return (
    <div className={styles.adminContainer}>
      <SidebarAdmin />
      <main className={styles.mainContent}>
        <AdminDashboard />
      </main>
    </div>
  );
}
