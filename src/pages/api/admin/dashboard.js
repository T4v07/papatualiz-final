import { pool } from "../../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido." });
  }

  try {
    // Total de utilizadores
    const [users] = await pool.query("SELECT COUNT(*) AS totalUsers FROM Utilizador");

    // Total de produtos
    const [products] = await pool.query("SELECT COUNT(*) AS totalProducts FROM Produtos");

    // Total de valor em compras
    const [totalSales] = await pool.query("SELECT SUM(Total_Valor) AS totalSales FROM Compra");

    // Vendas por mês (últimos 6 meses)
    const [salesByMonth] = await pool.query(`
      SELECT 
        DATE_FORMAT(Data_compra, '%Y-%m') AS month,
        SUM(Total_Valor) AS total
      FROM Compra
      WHERE Data_compra >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY month
      ORDER BY month ASC
    `);

    return res.status(200).json({
      totalUsers: users[0].totalUsers || 0,
      totalProducts: products[0].totalProducts || 0,
      totalSales: totalSales[0].totalSales || 0,
      salesByMonth,
    });
  } catch (error) {
    console.error("Erro ao obter dados da dashboard:", error);
    return res.status(500).json({ message: "Erro interno ao obter dados." });
  }
}
