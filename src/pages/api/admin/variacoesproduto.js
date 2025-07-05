import { pool } from "@/utils/db";

export default async function handler(req, res) {
  const { produtoId } = req.query;
  if (!produtoId) return res.status(400).json({ message: "produtoId é obrigatório" });

  try {
    const [variacoes] = await pool.query("SELECT * FROM ProdutoVariacoes WHERE produto_id = ?", [produtoId]);
    res.status(200).json(variacoes);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar variações" });
  }
}
