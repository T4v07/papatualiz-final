  import GestaoProdutos from "../../components/admin/GestaoProdutos";
  import SidebarAdmin from "../../components/admin/SidebarAdmin";
  import styles from "../../styles/admin.module.css";

  export default function ProdutosAdminPage() {
    return (
      <div className={styles.adminContainer}>
        <SidebarAdmin />
        <main className={styles.mainContent}>
          <GestaoProdutos />
        </main>
      </div>
    );
  }
