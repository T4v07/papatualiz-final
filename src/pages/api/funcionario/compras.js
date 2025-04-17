import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  try {
    // 1. Buscar todas as compras com info do cliente + estado da encomenda
    const [compras] = await pool.query(`
      SELECT 
        c.ID_compra,
        c.Data_compra,
        c.Total_Valor,
        u.Nome AS nome_utilizador,
        e.Estado AS estado_encomenda
      FROM Compra c
      JOIN Utilizador u ON c.ID_utilizador = u.ID_utilizador
      LEFT JOIN Encomenda e ON c.ID_compra = e.ID_compra
      ORDER BY c.ID_compra DESC
    `);

    // 2. Para cada compra, buscar os produtos relacionados
    for (const compra of compras) {
      const [produtos] = await pool.query(`
        SELECT 
          p.Nome_Produtos AS nome,
          cp.Quantidade AS quantidade,
          cp.Preco_unitario AS preco
        FROM Compra_Produto cp
        JOIN Produtos p ON cp.ID_produto = p.ID_produto
        WHERE cp.ID_compra = ?
      `, [compra.ID_compra]);

      compra.produtos = produtos;
    }

    res.status(200).json(compras);
  } catch (err) {
    console.error("Erro ao buscar compras:", err);
    res.status(500).json({ message: "Erro ao buscar compras." });
  }
}
