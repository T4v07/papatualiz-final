// /pages/admin/encomendas.js
import SidebarAdmin from "@/components/admin/SidebarAdmin";
import GestaoEncomendas from "@/components/admin/GestaoEncomendas";
import styles from "@/styles/admin.module.css";

export default function EncomendasAdminPage() {
  return (
    <div className="containerFull">
      <SidebarAdmin />
      <main className={styles.mainContent}>
        <GestaoEncomendas />
      </main>
    </div>
  );
}
