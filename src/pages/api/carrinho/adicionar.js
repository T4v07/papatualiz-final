import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Método não permitido");

  const { id_utilizador, id_produto, quantidade } = req.body;

  try {
    const [existe] = await pool.query(
      "SELECT * FROM Carrinho WHERE ID_utilizador = ? AND ID_produto = ?",
      [id_utilizador, id_produto]
    );

    if (existe.length > 0) {
      await pool.query(
        "UPDATE Carrinho SET Quantidade = Quantidade + ? WHERE ID_utilizador = ? AND ID_produto = ?",
        [quantidade, id_utilizador, id_produto]
      );
    } else {
      await pool.query(
        "INSERT INTO Carrinho (ID_utilizador, ID_produto, Quantidade) VALUES (?, ?, ?)",
        [id_utilizador, id_produto, quantidade]
      );
    }

    res.status(200).json({ message: "Adicionado com sucesso!" });
  } catch (err) {
    console.error("Erro ao adicionar ao carrinho:", err);
    res.status(500).json({ message: "Erro no servidor" });
  }
}
