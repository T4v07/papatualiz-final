import SidebarFuncionario from "@/components/funcionario/SidebarFuncionario";
import ControleStock from "@/components/funcionario/ControleStock";
import styles from "@/styles/estoque.module.css";

export default function ControleEstoque() {
  return (
    <div className="containerFull">
      <SidebarFuncionario />
      <div className={styles.conteudo}>
        <ControleStock />
      </div>
    </div>
  );
}
