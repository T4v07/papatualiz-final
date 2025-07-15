import SidebarAdmin from "@/components/admin/SidebarAdmin";
import VerCompras from "@/components/admin/VerCompras";
import styles from "@/styles/admin.module.css";

export default function ComprasAdminPage() {
  return (
    <div className="containerFull">
      <SidebarAdmin />
      <main className={styles.mainContent}>
        <VerCompras />
      </main>
    </div>
  );
}
