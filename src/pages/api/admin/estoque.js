import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const [rows] = await pool.query(`
        SELECT 
          p.ID_produto,
          p.Nome_Produtos,
          p.Marca,
          SUM(v.stock) AS stock_total,
          GROUP_CONCAT(DISTINCT v.tamanho ORDER BY v.tamanho SEPARATOR ', ') AS tamanhos
        FROM Produtos p
        JOIN ProdutoVariacoes v ON p.ID_produto = v.produto_id
        GROUP BY p.ID_produto, p.Nome_Produtos, p.Marca
        ORDER BY p.Nome_Produtos;
      `);

      return res.status(200).json(rows);
    } catch (err) {
      console.error("Erro ao buscar estoque:", err);
      return res.status(500).json({ message: "Erro ao buscar produtos" });
    }
  }

  res.status(405).json({ message: "Método não permitido" });
}
