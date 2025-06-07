// /pages/api/favoritos-do-utilizador.js
import { pool } from "@/utils/db";

export default async function handler(req, res) {
  const { email } = req.query;

  if (!email) return res.status(400).json({ message: "Email não fornecido" });

  try {
    const [userRows] = await pool.query(
      "SELECT ID_utilizador FROM Utilizador WHERE email = ?",
      [email]
    );

    if (userRows.length === 0)
      return res.status(404).json({ message: "Utilizador não encontrado" });

    const userId = userRows[0].ID_utilizador;

    const [favoritos] = await pool.query(
      "SELECT ID_produto FROM Favorito WHERE ID_utilizador = ?",
      [userId]
    );

    res.status(200).json(favoritos);
  } catch (err) {
    console.error("Erro ao buscar favoritos:", err);
    res.status(500).json({ message: "Erro no servidor" });
  }
}
