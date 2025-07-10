import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido." });
  }

  try {
    const [users] = await pool.query(`SELECT COUNT(*) AS totalUsers FROM Utilizador`);
    const [products] = await pool.query(`SELECT COUNT(*) AS totalProducts FROM Produtos`);
    const [sales] = await pool.query(`SELECT SUM(Total_Valor) AS totalSales FROM Compra`);
    const [discounted] = await pool.query(`SELECT COUNT(*) AS count FROM Produtos WHERE Desconto > 0`);

    const [lowStock] = await pool.query(`
      SELECT COUNT(DISTINCT produto_id) AS count
      FROM ProdutoVariacoes
      WHERE stock <= 5
    `);

    const [recent] = await pool.query(`
      SELECT COUNT(*) AS count FROM Produtos
      WHERE Data_Criacao >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `);

    const [salesByMonthRaw] = await pool.query(`
      SELECT DATE_FORMAT(Data_Compra, '%Y-%m') AS month, SUM(Total_Valor) AS total
      FROM Compra
      WHERE Data_Compra >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY month
      ORDER BY month ASC
    `);

    const [ordersByStateRaw] = await pool.query(`
      SELECT Estado, COUNT(*) AS count
      FROM Encomenda
      GROUP BY Estado
    `);

    const [productsByCategoryRaw] = await pool.query(`
      SELECT c.Tipo_de_Categoria AS categoria, COUNT(p.ID_produto) AS count
      FROM Produtos p
      JOIN Categoria c ON p.Tipo_de_Categoria = c.ID_categoria
      GROUP BY c.Tipo_de_Categoria
    `);

    const [latestOrdersRaw] = await pool.query(`
      SELECT e.ID_Encomenda, e.Estado, e.Data_criacao, c.Total_Valor, u.Nome
      FROM Encomenda e
      JOIN Compra c ON e.ID_Compra = c.ID_Compra
      JOIN Utilizador u ON c.ID_Utilizador = u.ID_Utilizador
      ORDER BY e.Data_criacao DESC
      LIMIT 5
    `);

    return res.status(200).json({
      totalUsers: users[0]?.totalUsers || 0,
      totalProducts: products[0]?.totalProducts || 0,
      totalSales: Number(sales[0]?.totalSales) || 0,
      productsWithDiscount: discounted[0]?.count || 0,
      lowStock: lowStock[0]?.count || 0,
      recentProducts: recent[0]?.count || 0,
      salesByMonth: salesByMonthRaw || [],
      ordersByState: ordersByStateRaw || [],
      productsByCategory: productsByCategoryRaw || [],
      latestOrders: latestOrdersRaw || [],
    });
  } catch (error) {
    console.error("Erro ao obter dados da dashboard:", error);
    return res.status(500).json({ message: "Erro ao buscar dados da dashboard." });
  }
}
