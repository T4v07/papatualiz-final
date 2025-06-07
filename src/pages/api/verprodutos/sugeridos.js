// /pages/api/produtos/sugeridos.js
import { pool } from "@/utils/db";

export default async function handler(req, res) {
  const { categoriaId, produtoId } = req.query;

  try {
    const [produtos] = await pool.execute(
      `SELECT * FROM Produtos WHERE Tipo_de_Categoria = ? AND ID_produto != ? LIMIT 4`,
      [categoriaId, produtoId]
    );
    res.status(200).json(produtos);
  } catch (error) {
    console.error("Erro ao buscar produtos sugeridos:", error);
    res.status(500).json({ message: "Erro ao buscar sugestões" });
  }
}
