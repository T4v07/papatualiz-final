import { useEffect, useState } from "react";
import styles from "@/styles/funcionario.module.css";


export default function FuncionarioDashboard() {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    fetch("/api/funcionario/dashboard")
      .then((res) => res.json())
      .then((data) => setDados(data));
  }, []);

  if (!dados) return <p>A carregar...</p>;

  return (
    <div className={styles.dashboard}>
      <div className={styles.card}>
        <h3>📦 Produtos</h3>
        <p>{dados.totalProdutos}</p>
      </div>
      <div className={styles.card}>
        <h3>🛒 Compras</h3>
        <p>{dados.totalCompras}</p>
      </div>
      <div className={styles.card}>
        <h3>🚚 Encomendas Pendentes</h3>
        <p>{dados.encomendasPendentes}</p>
      </div>
      <div className={styles.card}>
        <h3>⚠️ Stock Crítico</h3>
        <p>{dados.stockCritico}</p>
      </div>
    </div>
  );
}
