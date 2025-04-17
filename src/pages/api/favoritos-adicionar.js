// /pages/api/favoritos-adicionar.js
import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { userId, produtoId } = req.body;
  if (!userId || !produtoId) return res.status(400).json({ success: false, message: "Faltam dados" });

  try {
    const [existe] = await pool.query(
      "SELECT * FROM Favorito WHERE ID_utilizador = ? AND ID_produto = ?",
      [userId, produtoId]
    );

    if (existe.length > 0) {
      await pool.query(
        "DELETE FROM Favorito WHERE ID_utilizador = ? AND ID_produto = ?",
        [userId, produtoId]
      );
      return res.status(200).json({ success: true, favorito: false }); // removido
    } else {
      await pool.query(
        "INSERT INTO Favorito (ID_utilizador, ID_produto) VALUES (?, ?)",
        [userId, produtoId]
      );
      return res.status(200).json({ success: true, favorito: true }); // adicionado
    }
  } catch (err) {
    console.error("Erro ao atualizar favoritos:", err);
    return res.status(500).json({ success: false, message: "Erro interno" });
  }
}
