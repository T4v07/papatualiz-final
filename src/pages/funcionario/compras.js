import { useEffect, useState } from "react";
import SidebarFuncionario from "@/components/funcionario/SidebarFuncionario";
import ComprasClientesFuncionario from "@/components/funcionario/ComprasClientesFuncionario";
import styles from "@/styles/funcionario.module.css";

export default function ComprasFuncionarioPage() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompras() {
      try {
        const res = await fetch("/api/funcionario/compras");
        const data = await res.json();
        setCompras(data);
      } catch (err) {
        console.error("Erro ao buscar compras:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCompras();
  }, []);

  return (
    <div className={styles.funcionarioContainer}>
      <SidebarFuncionario />
      <main className={styles.mainContent}>
        <h2>🧾 Compras dos Clientes</h2>
        {loading ? <p>A carregar...</p> : <ComprasClientesFuncionario compras={compras} />}
      </main>
    </div>
  );
}
