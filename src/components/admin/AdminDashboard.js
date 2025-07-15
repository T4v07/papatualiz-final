// src/components/admin/AdminDashboard.js
import React from "react";
import { useEffect, useState } from "react";
import styles from '@/styles/adminDashboard.module.css';
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";
import CountUp from "react-countup";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(ChartDataLabels);

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
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
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
    latestOrders,
    topProdutosVendidos,
    novosRegistosPorMes,
    faturacaoMensal
  } = data;

  return (
    <div className={styles.dashboardContent}>
      <div className={styles.header}>
        <h2>Olá, Administrador 👋</h2>
        <p>Bem-vindo ao painel de administração</p>
      </div>

      <div className={styles.kpiGrid}>
        {[{
          icon: "👥", label: "Total de Utilizadores", value: totalUsers, bgColor: "#3498db", tooltip: "Número total de contas registadas"
        }, {
          icon: "📦", label: "Total de Produtos", value: totalProducts, bgColor: "#9b59b6", tooltip: "Quantidade de produtos disponíveis no sistema"
        }, {
          icon: "💰", label: "Total de Vendas", value: totalSales, isCurrency: true, bgColor: "#f39c12", tooltip: "Soma total de todas as encomendas"
        }, {
          icon: "⚠️", label: "Stock Crítico", value: lowStock, bgColor: "#e74c3c", tooltip: "Produtos com stock menor ou igual a 5"
        }, {
          icon: "🏷️", label: "Produtos com Desconto", value: productsWithDiscount, bgColor: "#1abc9c", tooltip: "Produtos com preço promocional ativo"
        }, {
          icon: "🆕", label: "Novos Produtos", value: recentProducts, bgColor: "#2ecc71", tooltip: "Produtos adicionados nos últimos 30 dias"
        }].map((kpi, i) => (
          <div key={i} className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ backgroundColor: kpi.bgColor }}>{kpi.icon}</div>
            <div className={styles.kpiInfo}>
              <span>{kpi.label}</span>
              <strong>
                {kpi.isCurrency
                  ? <CountUp end={kpi.value || 0} duration={1.5} decimals={2} suffix=" €" />
                  : <CountUp end={kpi.value || 0} duration={1.5} />
                }
              </strong>
            </div>
          </div>
        ))}
      </div>

      {/* Primeiros 3 Gráficos */}
      <div className={styles.chartsContainer}>
        <div className={styles.chart}>
          <h4>📈 Vendas nos Últimos 6 Meses</h4>
          <Bar data={{
            labels: salesByMonth?.map(v => v.month),
            datasets: [{
              label: "Total de Vendas (€)",
              data: salesByMonth?.map(v => v.total),
              backgroundColor: "rgba(0, 123, 255, 0.6)",
              borderColor: "#007bff",
              borderWidth: 2,
              borderRadius: 6,
            }]
          }} options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              datalabels: {
                anchor: "end",
                align: "top",
                color: "#000",
                font: { weight: "bold" },
                formatter: (value) => `${Number(value).toFixed(2)}€`
              }
            },
            scales: {
              y: { beginAtZero: true, ticks: { color: "#333" } },
              x: { ticks: { color: "#333" } }
            }
          }} />
        </div>

        <div className={styles.chart}>
          <h4>📦 Encomendas por Estado</h4>
          <Pie data={{
            labels: ordersByState?.map(e => e.Estado),
            datasets: [{
              data: ordersByState?.map(e => e.count),
              backgroundColor: ["#0074D9", "#2ECC40", "#FF851B", "#B10DC9", "#FF4136"],
              hoverOffset: 8
            }]
          }} options={{
            responsive: true,
            plugins: {
              legend: {
                position: "bottom",
                labels: { color: "#444", boxWidth: 16, padding: 10 }
              }
            }
          }} />
        </div>

        <div className={styles.chart}>
          <h4>📁 Produtos por Categoria</h4>
          <Bar data={{
            labels: productsByCategory?.map(c => c.categoria),
            datasets: [{
              label: "Total de Produtos",
              data: productsByCategory?.map(c => c.count),
              backgroundColor: "rgba(46, 204, 113, 0.6)",
              borderColor: "#27ae60",
              borderWidth: 2,
              borderRadius: 8,
            }]
          }} options={{
            responsive: true,
            indexAxis: "y",
            plugins: {
              legend: { display: false },
              datalabels: {
                anchor: "end",
                align: "right",
                color: "#333",
                font: { weight: "bold" },
                formatter: (val) => `${val}`
              }
            }
          }} />
        </div>
      </div>

      {/* 🔥 GRÁFICOS TRIPLOS: Faturação, Mais Vendidos, Registos */}
      <div className={styles.tripleChartContainer}>
        {[
          {
            title: "📈 Faturação Mensal",
            data: faturacaoMensal?.map(e => e.total),
            labels: faturacaoMensal?.map(e => e.mes),
            color: "rgba(255, 206, 86, 0.6)",
            border: "#f1c40f",
            format: (val) => `${Number(val).toFixed(2)}€`
          },
          {
            title: "🔥 Produtos Mais Vendidos",
            data: topProdutosVendidos?.map(p => p.totalVendido),
            labels: topProdutosVendidos?.map(p => p.nome),
            color: "rgba(255, 99, 132, 0.6)",
            border: "#e74c3c",
            indexAxis: "y",
            format: (val) => `${val}`
          },
          {
            title: "🆕 Novos Registos por Mês",
            data: novosRegistosPorMes?.map(r => r.total),
            labels: novosRegistosPorMes?.map(r => r.mes),
            color: "rgba(153, 102, 255, 0.6)",
            border: "#8e44ad",
            format: (val) => `${val}`
          }
        ].map((chart, idx) => (
          <div key={idx} className={styles.chartBox}>
            <h4>{chart.title}</h4>
            <Bar data={{
              labels: chart.labels,
              datasets: [{
                label: chart.title,
                data: chart.data,
                backgroundColor: chart.color,
                borderColor: chart.border,
                borderWidth: 2,
                borderRadius: 6,
              }]
            }} options={{
              responsive: true,
              indexAxis: chart.indexAxis || "x",
              plugins: {
                legend: { display: false },
                datalabels: {
                  anchor: "end",
                  align: chart.indexAxis === "y" ? "right" : "top",
                  color: "#000",
                  font: { weight: "bold" },
                  formatter: chart.format
                }
              },
              scales: {
                y: { beginAtZero: true, ticks: { color: "#333" } },
                x: { ticks: { color: "#333" } }
              }
            }} />
          </div>
        ))}
      </div>

      {/* Últimas Encomendas */}
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
            {latestOrders?.map((e) => (
              <React.Fragment key={e.ID_encomenda}>
                <tr>
                  <td>{e.Nome}</td>
                  <td>{new Date(e.Data_criacao).toLocaleDateString()}</td>
                  <td>{Number(e.Total_Valor).toFixed(2)} €</td>
                  <td>
                    <span className={`${styles.badge} ${styles[e.Estado.toLowerCase()]}`}>
                      {e.Estado}
                    </span>
                  </td>
                </tr>
                <tr className={styles.produtosRow}>
                  <td colSpan="4">
                    <div className={styles.produtosList}>
                      {e.Produtos?.length > 0 ? (
                        e.Produtos.map((prod, idx) => (
                          <div key={idx} className={styles.produtoItem}>
                            <span><strong>{prod.nome}</strong></span>
                            <span>Cor: {prod.cor}</span>
                            <span>Tamanho: {prod.tamanho}</span>
                            <span>Qtd: {prod.quantidade}</span>
                          </div>
                        ))
                      ) : (
                        <span className={styles.semProdutos}>Sem produtos associados</span>
                      )}
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
