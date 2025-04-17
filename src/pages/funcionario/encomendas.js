// pages/funcionario/encomendas.js
import { useEffect, useState } from "react";
import SidebarFuncionario from "@/components/funcionario/SidebarFuncionario";
import GestaoEncomendas from "@/components/funcionario/GestaoEncomendas";
import styles from "@/styles/funcionario.module.css";

export default function PaginaEncomendasFuncionario() {
  const [encomendas, setEncomendas] = useState([]);

  useEffect(() => {
    async function fetchEncomendas() {
      const res = await fetch("/api/funcionario/encomendas");
      const data = await res.json();
      setEncomendas(data);
    }
    fetchEncomendas();
  }, []);

  return (
    <div className={styles.funcionarioContainer}>
      <SidebarFuncionario />
      <main className={styles.mainContent}>
        <h2>📦 Gestão de Encomendas</h2>
        <GestaoEncomendas encomendas={encomendas} setEncomendas={setEncomendas} />
      </main>
    </div>
  );
}
