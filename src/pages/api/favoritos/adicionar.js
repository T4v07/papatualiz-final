// src/pages/api/favoritos/adicionar.js
import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { id_utilizador, id_produto } = req.body;

  if (!id_utilizador || !id_produto) {
    return res.status(400).json({ message: "Dados incompletos" });
  }

  try {
    const [[existe]] = await pool.query(
      "SELECT * FROM Favorito WHERE ID_utilizador = ? AND ID_produto = ?",
      [id_utilizador, id_produto]
    );

    if (existe) {
      await pool.query(
        "DELETE FROM Favorito WHERE ID_utilizador = ? AND ID_produto = ?",
        [id_utilizador, id_produto]
      );
    } else {
      await pool.query(
        "INSERT INTO Favorito (ID_utilizador, ID_produto, Data_adicionado) VALUES (?, ?, NOW())",
        [id_utilizador, id_produto]
      );
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Erro ao adicionar/remover favorito:", err);
    res.status(500).json({ message: "Erro ao processar favorito" });
  }
}
