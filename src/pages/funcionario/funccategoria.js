
import SidebarFuncionario from "@/components/funcionario/SidebarFuncionario";
import Funcionarioscategoria from "@/components/funcionario/Funcionarioscategoria";

export default function PaginaCategorias() {
  return (
    <div className="containerFull">
      <SidebarFuncionario />
      <div className="mainFormContainer">
        <Funcionarioscategoria />
      </div>
    </div>
  );
}
