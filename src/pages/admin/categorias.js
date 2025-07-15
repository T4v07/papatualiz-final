import SidebarAdmin from "@/components/admin/SidebarAdmin";
import GestaoCategorias from "@/components/admin/GestaoCategorias";

export default function PaginaCategorias() {
  return (
    <div className="containerFull">
      <SidebarAdmin />
      <div className="mainFormContainer">
        <GestaoCategorias />
      </div>
    </div>
  );
}
