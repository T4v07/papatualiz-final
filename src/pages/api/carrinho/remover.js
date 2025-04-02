import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "DELETE") return res.status(405).end("Método não permitido");

  const { id_utilizador, id_produto } = req.body;

  try {
    await pool.query(
      "DELETE FROM Carrinho WHERE ID_utilizador = ? AND ID_produto = ?",
      [id_utilizador, id_produto]
    );

    res.status(200).json({ message: "Removido com sucesso!" });
  } catch (err) {
    console.error("Erro ao remover do carrinho:", err);
    res.status(500).json({ message: "Erro ao remover item" });
  }
}
