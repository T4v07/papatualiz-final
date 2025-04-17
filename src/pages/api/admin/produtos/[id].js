import { pool } from "@/utils/db";

export default async function handler(req, res) {
  const { id } = req.query;
  const produtoId = parseInt(id);

  if (isNaN(produtoId)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    const [result] = await pool.query(
      "SELECT * FROM Produtos WHERE ID_produto = ?",
      [produtoId]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    res.status(200).json(result[0]);
  } catch (err) {
    console.error("Erro ao buscar produto:", err);
    res.status(500).json({ message: "Erro ao buscar produto" });
  }
}
