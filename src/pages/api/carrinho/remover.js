import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { id_utilizador, id_produto } = req.body;

  if (!id_utilizador || !id_produto) {
    return res.status(400).json({ message: "Dados incompletos" });
  }

  try {
    await pool.query(
      `DELETE FROM Carrinho WHERE ID_utilizador = ? AND ID_produto = ?`,
      [id_utilizador, id_produto]
    );

    return res.status(200).json({ message: "Produto removido do carrinho." });
  } catch (err) {
    console.error("Erro ao remover do carrinho:", err);
    return res.status(500).json({ message: "Erro no servidor" });
  }
}
