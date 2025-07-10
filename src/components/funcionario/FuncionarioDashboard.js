import { useEffect, useState } from "react";
import styles from "@/styles/funcionarioDashboard.module.css";
import { Bar, Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function FuncionarioDashboard() {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    async function fetchDados() {
      try {
        const res = await fetch("/api/funcionario/dashboard");
        const data = await res.json();

        setDados({
          totalProdutos: data.totalProducts,
          totalCompras: data.totalSales ? data.totalSales.toFixed(2) + " €" : "0.00 €",
          encomendasPendentes: data.ordersByState?.find(e => e.Estado === "Pendente")?.count || 0,
          stockCritico: data.lowStock,
          salesByMonth: data.salesByMonth || [],
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
      <div className={styles.kpiGrid}>
        <div className={styles.card}>
          <div className={styles.icon}>📦</div>
          <div className={styles.info}>
            <h3>Produtos</h3>
            <p>{dados.totalProdutos}</p>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.icon}>🛒</div>
          <div className={styles.info}>
            <h3>Compras</h3>
            <p>{dados.totalCompras}</p>
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
          <h4>📈 Vendas Últimos 6 Meses</h4>
          <Bar
            data={{
              labels: dados.salesByMonth.map((item) => item.month),
              datasets: [{
                label: "Vendas (€)",
                data: dados.salesByMonth.map((item) => item.total),
                backgroundColor: "rgba(0,123,255,0.6)",
                borderColor: "#007bff",
                borderWidth: 2,
                borderRadius: 6,
              }],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                y: { beginAtZero: true, ticks: { color: "#333" } },
                x: { ticks: { color: "#333" } },
              },
            }}
          />
        </section>

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
