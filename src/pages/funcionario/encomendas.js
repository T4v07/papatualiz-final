// pages/funcionario/encomendas.js
import SidebarFuncionario from "@/components/funcionario/SidebarFuncionario";
import GestaoEncomendas from "@/components/funcionario/GestaoEncomendas";
import styles from "@/styles/admin.module.css";

export default function EncomendasAdminPage() {
  return (
    <div className="containerFull">
      <SidebarFuncionario />
      <main className={styles.mainContent}>
        <GestaoEncomendas />
      </main>
    </div>
  );
}
