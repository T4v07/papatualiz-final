// /pages/api/funcionario/dashboard.js
import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido." });
  }

  try {
    const [products] = await pool.query(`SELECT COUNT(*) AS totalProducts FROM Produtos`);

    const [lowStock] = await pool.query(`
      SELECT COUNT(DISTINCT produto_id) AS count
      FROM ProdutoVariacoes
      WHERE stock <= 5
    `);

    const [pendingSupport] = await pool.query(`
      SELECT COUNT(*) AS count
      FROM Suporte
      WHERE Estado = 'pendente'
    `);

    const [pendingOrders] = await pool.query(`
      SELECT COUNT(*) AS count
      FROM Encomenda
      WHERE Estado IN ('pendente', 'em preparação')
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

    return res.status(200).json({
      totalProducts: products[0]?.totalProducts || 0,
      lowStock: lowStock[0]?.count || 0,
      pendingSupport: pendingSupport[0]?.count || 0,
      pendingOrders: pendingOrders[0]?.count || 0,
      ordersByState: ordersByStateRaw || [],
      productsByCategory: productsByCategoryRaw || [],
    });
  } catch (error) {
    console.error("Erro na dashboard do funcionário:", error);
    return res.status(500).json({ message: "Erro ao buscar dados da dashboard do funcionário." });
  }
}
