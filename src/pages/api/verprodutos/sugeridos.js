import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { categoriaId, produtoId } = req.query;

  if (!categoriaId || !produtoId) {
    return res.status(400).json({ message: "Parâmetros inválidos" });
  }

  try {
    const [rows] = await pool.execute(`
      SELECT p.*, c.Tipo_de_Produto, c.Tipo_de_Categoria
      FROM Produtos p
      JOIN Categoria c ON p.Tipo_de_Categoria = c.ID_categoria
      WHERE p.Tipo_de_Categoria = ? AND p.ID_produto != ?
      ORDER BY RAND()
      LIMIT 4
    `, [categoriaId, produtoId]);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Erro ao buscar produtos sugeridos:", error);
    res.status(500).json({ message: "Erro ao buscar produtos sugeridos" });
  }
}
