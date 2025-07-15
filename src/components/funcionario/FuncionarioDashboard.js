import { useEffect, useState, useContext } from "react";
import styles from "@/styles/funcionarioDashboard.module.css";
import { Bar, Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";
import AuthContext from "@/context/AuthContext";

export default function FuncionarioDashboard() {
  const [dados, setDados] = useState(null);
  const { user } = useContext(AuthContext); // pega o nome diretamente do contexto

  useEffect(() => {
    async function fetchDados() {
      try {
        const res = await fetch("/api/funcionario/dashboard");
        const data = await res.json();

        setDados({
          totalProdutos: data.totalProducts,
          stockCritico: data.lowStock,
          suportePendente: data.pendingSupport,
          encomendasPendentes: data.pendingOrders,
          ordersByState: data.ordersByState || [],
          productsByCategory: data.productsByCategory || [],
        });
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }

    fetchDados();
  }, []);

  if (!dados) return <p>Carregando dashboard...</p>;

  return (
    <div className={styles.dashboard}>
      <h2 className={styles.boasVindas}>Olá, {user?.nome || "Funcionário"} 👋</h2>

      <div className={styles.kpiGrid}>
        <div className={styles.card}>
          <div className={styles.icon}>📦</div>
          <div className={styles.info}>
            <h3>Produtos</h3>
            <p>{dados.totalProdutos}</p>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.icon}>🧾</div>
          <div className={styles.info}>
            <h3>Pedidos Suporte</h3>
            <p>{dados.suportePendente}</p>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.icon}>🚚</div>
          <div className={styles.info}>
            <h3>Encomendas Pendentes</h3>
            <p>{dados.encomendasPendentes}</p>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.icon}>⚠️</div>
          <div className={styles.info}>
            <h3>Stock Crítico</h3>
            <p>{dados.stockCritico}</p>
          </div>
        </div>
      </div>

      <div className={styles.chartsContainer}>
        <section className={styles.chart}>
          <h4>📦 Encomendas por Estado</h4>
          <Pie
            data={{
              labels: dados.ordersByState.map((e) => e.Estado),
              datasets: [{
                label: "Encomendas",
                data: dados.ordersByState.map((e) => e.count),
                backgroundColor: ["#0074D9", "#2ECC40", "#FF851B", "#B10DC9", "#FF4136"],
                borderWidth: 1,
                hoverOffset: 8,
              }],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "bottom",
                  labels: { color: "#444", boxWidth: 16, padding: 10 },
                },
              },
            }}
          />
        </section>

        <section className={styles.chart}>
          <h4>📁 Produtos por Categoria</h4>
          <Bar
            data={{
              labels: dados.productsByCategory.map((c) => c.categoria),
              datasets: [{
                label: "Produtos",
                data: dados.productsByCategory.map((c) => c.count),
                backgroundColor: "rgba(46, 204, 113, 0.6)",
                borderColor: "#27ae60",
                borderWidth: 2,
                borderRadius: 8,
              }],
            }}
            options={{
              responsive: true,
              indexAxis: "y",
              plugins: { legend: { display: false } },
              scales: {
                x: { beginAtZero: true, ticks: { color: "#333" } },
                y: { ticks: { color: "#333" } },
              },
            }}
          />
        </section>
      </div>
    </div>
  );
}
