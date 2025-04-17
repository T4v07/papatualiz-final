// src/pages/areaFuncionario.js
import {useContext, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import { useRouter } from "next/router";
import SidebarFuncionario from "../components/funcionario/SidebarFuncionario";
import FuncionarioDashboard from "@/components/funcionario/FuncionarioDashboard";
import styles from "../styles/funcionario.module.css";



export default function AreaFuncionario() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.Tipo_de_Conta !== "funcionario") {
      router.push("/servicosLogin");
    }
  }, [user]);

  return (
    <div className={styles.adminContainer}>
      <SidebarFuncionario />
      <main className={styles.mainContent}>
        <FuncionarioDashboard />
      </main>
    </div>
  );
}
