import { useContext, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import { useRouter } from "next/router";
import SidebarFuncionario from "@/components/funcionario/SidebarFuncionario";
import FuncionarioDashboard from "@/components/funcionario/FuncionarioDashboard";
import styles from "../styles/funcionario.module.css";

export default function AreaFuncionario() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || user.tipo_de_conta !== "funcionario") {
        router.push("/servicosLogin");
      }
    }
  }, [user, loading, router]);

  if (loading) return <div>Carregando...</div>;

  if (!user || user.tipo_de_conta !== "funcionario") return null;

  return (
    <div className={styles.adminContainer}>
      <SidebarFuncionario />
      <main className={styles.mainContent}>
        <FuncionarioDashboard />
      </main>
    </div>
  );
}
