// /pages/api/favoritos/listar.js
import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { id_utilizador } = req.query;

  if (!id_utilizador) {
    return res.status(400).json({ message: "ID do utilizador não fornecido" });
  }

  try {
    const [favoritos] = await pool.query(
      "SELECT ID_produto FROM Favorito WHERE ID_utilizador = ?",
      [id_utilizador]
    );

    res.status(200).json(favoritos);
  } catch (err) {
    console.error("Erro ao listar favoritos:", err);
    res.status(500).json({ message: "Erro no servidor" });
  }
}
