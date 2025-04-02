import { useEffect, useState } from "react";
import styles from "../../styles/adminDashboard.module.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  // Verifica se os dados foram carregados corretamente
  if (!data) return <p className={styles.loading}>Carregando dados...</p>;

  // Verificação para garantir que `salesByMonth` não seja undefined
  const salesByMonth = data.salesByMonth || [];

  const chartData = {
    labels: salesByMonth.map((s) => s.month), // Agora usa salesByMonth com fallback para array vazio
    datasets: [
      {
        label: "Vendas €",
        data: salesByMonth.map((s) => s.total), // Mesmo para os dados de vendas
        backgroundColor: "#003366",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Vendas nos Últimos 6 Meses" },
    },
  };

  return (
    <div className={styles.dashboardContent}>
      <h2>Painel de Administração</h2>
      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>Total de Utilizadores</h3>
          <p>{data.totalUsers}</p>
        </div>
        <div className={styles.card}>
          <h3>Total de Produtos</h3>
          <p>{data.totalProducts}</p>
        </div>
        <div className={styles.card}>
          <h3>Total de Vendas</h3>
          <p>{Number(data.totalSales || 0).toFixed(2)} €</p>
        </div>
      </div>
      <div className={styles.chart}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
