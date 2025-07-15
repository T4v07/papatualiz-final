import SidebarFuncionario from "@/components/funcionario/SidebarFuncionario";
import VerCompras from "@/components/funcionario/ComprasClientesFuncionario";
import styles from "@/styles/admin.module.css";

export default function ComprasAdminPage() {
  return (
    <div className="containerFull">
      <SidebarFuncionario />
      <main className={styles.mainContent}>
        <VerCompras />
      </main>
    </div>
  );
}
