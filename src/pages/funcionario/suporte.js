import SidebarFuncionario from "@/components/funcionario/SidebarFuncionario";
import FuncionarioSuporte from "@/components/funcionario/SuporteFuncionario";
import styles from "@/styles/admin.module.css";

export default function SuporteFuncionarioPage() {
  return (
    <div className={styles.funcionarioContainer}>
      <SidebarFuncionario />
      <div className={styles.mainContent}>
        <FuncionarioSuporte />
      </div>
    </div>
  );
}
