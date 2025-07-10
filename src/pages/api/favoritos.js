// /pages/api/favoritos.js
import { pool } from "@/utils/db";

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    // Listar favoritos
    const { id_utilizador } = req.query;

    if (!id_utilizador) {
      return res.status(400).json({ message: "ID do utilizador não fornecido" });
    }

    try {
      const [favoritos] = await pool.query(
        "SELECT ID_produto FROM Favoritos WHERE ID_utilizador = ?",
        [id_utilizador]
      );
      return res.status(200).json(favoritos);
    } catch (err) {
      console.error("Erro ao listar favoritos:", err);
      return res.status(500).json({ message: "Erro no servidor" });
    }
  } else if (method === "POST") {
    // Adicionar favorito
    const { id_utilizador, id_produto } = req.body;

    if (!id_utilizador || !id_produto) {
      return res.status(400).json({ message: "ID do utilizador e produto são obrigatórios" });
    }

    try {
      await pool.query(
        "INSERT INTO Favoritos (ID_utilizador, ID_produto) VALUES (?, ?) ON DUPLICATE KEY UPDATE ID_produto = ID_produto",
        [id_utilizador, id_produto]
      );
      return res.status(200).json({ message: "Favorito adicionado com sucesso" });
    } catch (err) {
      console.error("Erro ao adicionar favorito:", err);
      return res.status(500).json({ message: "Erro no servidor" });
    }
  } else if (method === "DELETE") {
    // Remover favorito
    const { id_utilizador, id_produto } = req.body;

    if (!id_utilizador || !id_produto) {
      return res.status(400).json({ message: "ID do utilizador e produto são obrigatórios" });
    }

    try {
      await pool.query(
        "DELETE FROM Favoritos WHERE ID_utilizador = ? AND ID_produto = ?",
        [id_utilizador, id_produto]
      );
      return res.status(200).json({ message: "Favorito removido com sucesso" });
    } catch (err) {
      console.error("Erro ao remover favorito:", err);
      return res.status(500).json({ message: "Erro no servidor" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    return res.status(405).end(`Método ${method} não permitido`);
  }
}
