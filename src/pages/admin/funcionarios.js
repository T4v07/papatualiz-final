import SidebarAdmin from "@/components/admin/SidebarAdmin";
import GestaoFuncionarios from "@/components/admin/GestaoFuncionarios";
import styles from "@/styles/admin.module.css";

export default function PaginaFuncionarios() {
  return (
    <div className="containerFull">
      <SidebarAdmin />
      <main className={styles.mainContent}>
        <GestaoFuncionarios />
      </main>
    </div>
  );
}
