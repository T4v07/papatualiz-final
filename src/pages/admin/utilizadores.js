import SidebarAdmin from "@/components/admin/SidebarAdmin";
import GestaoUtilizadores from "@/components/admin/GestaoUtilizadores";
import styles from "@/styles/admin.module.css";

export default function UtilizadoresAdminPage() {
  return (
    <div className={styles.adminContainer}>
      <SidebarAdmin />
      <main className={styles.mainContent}>
        <GestaoUtilizadores />
      </main>
    </div>
  );
}
