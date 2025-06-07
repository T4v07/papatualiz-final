// src/pages/api/carrinho/adicionar.js
import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { id_utilizador, id_produto, quantidade } = req.body;

  // Verificação clara de dados recebidos
  if (!id_utilizador || !id_produto || !quantidade) {
    return res.status(400).json({ message: "Dados incompletos no corpo da requisição." });
  }

  try {
    // Verificar se o produto já está no carrinho do utilizador
    const [[existe]] = await pool.query(
      "SELECT * FROM Carrinho WHERE ID_utilizador = ? AND ID_produto = ?",
      [id_utilizador, id_produto]
    );

    if (existe) {
      // Atualizar a quantidade
      await pool.query(
        "UPDATE Carrinho SET Quantidade = Quantidade + ? WHERE ID_utilizador = ? AND ID_produto = ?",
        [quantidade, id_utilizador, id_produto]
      );
    } else {
      // Inserir novo item
      await pool.query(
        "INSERT INTO Carrinho (ID_utilizador, ID_produto, Quantidade) VALUES (?, ?, ?)",
        [id_utilizador, id_produto, quantidade]
      );
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Erro ao adicionar ao carrinho:", err);
    res.status(500).json({ message: "Erro interno ao adicionar ao carrinho." });
  }
}
