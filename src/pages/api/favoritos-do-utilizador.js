// /pages/api/favoritos-do-utilizador.js
import { pool } from "@/utils/db";

export default async function handler(req, res) {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: "Email é obrigatório" });

  try {
    const [utilizadorResult] = await pool.query(
      "SELECT ID_utilizador FROM Utilizador WHERE Email = ?",
      [email]
    );
    const utilizador = utilizadorResult[0];
    if (!utilizador) return res.status(404).json([]);

    const [favoritos] = await pool.query(
      `SELECT P.* FROM Produtos P
       JOIN Favorito F ON P.ID_produto = F.ID_produto
       WHERE F.ID_utilizador = ?`,
      [utilizador.ID_utilizador]
    );

    res.status(200).json(favoritos);
  } catch (err) {
    console.error("Erro ao buscar favoritos:", err);
    res.status(500).json({ message: "Erro interno" });
  }
}
