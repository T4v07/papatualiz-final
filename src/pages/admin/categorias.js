import GestaoCategorias from "../../components/admin/GestaoCategorias";
import SidebarAdmin from "../../components/admin/SidebarAdmin";
import styles from "../../styles/admin.module.css";

export default function PaginaCategorias() {
  return (
    <div className={styles.adminContainer}>
      <SidebarAdmin />
      <main className={styles.mainContent}>
        <GestaoCategorias />
      </main>
    </div>
  );
}
