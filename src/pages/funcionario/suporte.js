import SidebarFuncionario from "@/components/funcionario/SidebarFuncionario";
import FuncionarioSuporte from "@/components/funcionario/SuporteFuncionario";
import styles from "@/styles/admin.module.css";

export default function SuporteFuncionarioPage() {
  return (
    <div className="containerFull">
      <SidebarFuncionario />
      <div className={styles.mainContent}>
        <FuncionarioSuporte />
      </div>
    </div>
  );
}
