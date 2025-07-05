import { useEffect, useState } from "react";
import styles from "@/styles/AdminDashboard.module.css";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get("/api/admin/dashboard");
        setData(res.data);
      } catch (err) {
        console.error("Erro ao buscar dados do dashboard:", err);
      }
    }

    fetchData();
  }, []);

  if (!data) return <div className={styles.loading}>Carregando...</div>;

  const {
    totalUsers,
    totalProducts,
    totalSales,
    lowStock,
    productsWithDiscount,
    recentProducts,
    salesByMonth,
    ordersByState,
    productsByCategory,
    latestOrders
  } = data;

  return (
    <div className={styles.dashboardContent}>
      <div className={styles.header}>
        <h2>Olá, Administrador 👋</h2>
        <p>Bem-vindo ao painel de administração</p>
      </div>

      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}>👥</div>
          <div className={styles.kpiInfo}>
            <span>Total de Utilizadores</span>
            <strong>{totalUsers}</strong>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}>📦</div>
          <div className={styles.kpiInfo}>
            <span>Total de Produtos</span>
            <strong>{totalProducts}</strong>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}>💰</div>
          <div className={styles.kpiInfo}>
            <span>Total de Vendas</span>
            <strong>{totalSales ? totalSales.toFixed(2) : "0.00"} €</strong>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}>⚠️</div>
          <div className={styles.kpiInfo}>
            <span>Stock Crítico</span>
            <strong>{lowStock}</strong>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}>🏷️</div>
          <div className={styles.kpiInfo}>
            <span>Produtos com Desconto</span>
            <strong>{productsWithDiscount}</strong>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}>🆕</div>
          <div className={styles.kpiInfo}>
            <span>Novos Produtos</span>
            <strong>{recentProducts}</strong>
          </div>
        </div>
      </div>
      <div className={styles.chartsContainer}>
        <div className={styles.chart}>
          <h4>📈 Vendas nos Últimos 6 Meses</h4>
          <Bar
            data={{
              labels: (salesByMonth || []).map((v) => v.month),
              datasets: [
                {
                  label: "Total de Vendas (€)",
                  data: (salesByMonth || []).map((v) => v.total),
                  backgroundColor: "rgba(0, 123, 255, 0.6)",
                  borderColor: "#007bff",
                  borderWidth: 2,
                  borderRadius: 6,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { color: "#333" },
                },
                x: {
                  ticks: { color: "#333" },
                },
              },
            }}
          />
        </div>

        <div className={styles.chart}>
          <h4>📦 Encomendas por Estado</h4>
          <Pie
            data={{
              labels: (ordersByState || []).map((e) => e.Estado),
              datasets: [
                {
                  label: "Encomendas",
                  data: (ordersByState || []).map((e) => e.count),
                  backgroundColor: [
                    "#0074D9", "#2ECC40", "#FF851B", "#B10DC9", "#FF4136"
                  ],
                  borderWidth: 1,
                  hoverOffset: 8,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "bottom",
                  labels: {
                    color: "#444",
                    boxWidth: 16,
                    padding: 10,
                  },
                },
              },
            }}
          />
        </div>

        <div className={styles.chart}>
          <h4>📁 Produtos por Categoria</h4>
          <Bar
            data={{
              labels: (productsByCategory || []).map((c) => c.categoria),
              datasets: [
                {
                  label: "Total de Produtos",
                  data: (productsByCategory || []).map((c) => c.count),
                  backgroundColor: "rgba(46, 204, 113, 0.6)",
                  borderColor: "#27ae60",
                  borderWidth: 2,
                  borderRadius: 8,
                },
              ],
            }}
            options={{
              responsive: true,
              indexAxis: "y",
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  beginAtZero: true,
                  ticks: { color: "#333" },
                },
                y: {
                  ticks: { color: "#333" },
                },
              },
            }}
          />
        </div>
      </div>
      <div className={styles.tableContainer}>
        <h4>📋 Últimas Encomendas</h4>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Data</th>
              <th>Valor (€)</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {(latestOrders || []).map((e) => (
              <tr key={e.ID_Encomenda}>
                <td>{e.Nome}</td>
                <td>{new Date(e.Data_criacao).toLocaleDateString()}</td>
                <td>{Number(e.Total_Valor).toFixed(2)} €</td>
                <td>
                  <span
                    className={`${styles.badge} ${
                      e.Estado === "Entregue"
                        ? styles.success
                        : e.Estado === "Pendente"
                        ? styles.warning
                        : styles.danger
                    }`}
                  >
                    {e.Estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
                </table>
      </div>
    </div> 
  );
}

