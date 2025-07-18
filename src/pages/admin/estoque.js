import SidebarAdmin from "@/components/admin/SidebarAdmin";
import GestaoEstoque from "@/components/admin/GestaoEstoque";
import styles from "@/styles/estoque.module.css";

export default function ControleEstoque() {
  return (
    <div className="containerFull">
      <SidebarAdmin />
      <div className={styles.conteudo}>
        <GestaoEstoque />
      </div>
    </div>
  );
}
