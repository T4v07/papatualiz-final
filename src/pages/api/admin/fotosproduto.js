import { pool } from "@/utils/db";

export default async function handler(req, res) {
  const { produtoId } = req.query;
  if (!produtoId) return res.status(400).json({ message: "produtoId é obrigatório" });

  try {
    const [fotos] = await pool.query("SELECT * FROM ProdutoFotos WHERE produto_id = ?", [produtoId]);
    res.status(200).json(fotos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar fotos" });
  }
}
