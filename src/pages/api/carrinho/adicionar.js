import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { id_utilizador, id_produto, quantidade } = req.body;

  if (!id_utilizador || !id_produto || !quantidade) {
    return res.status(400).json({ message: "Dados incompletos" });
  }

  try {
    // Verifica se o item já está no carrinho
    const [existe] = await pool.query(
      `SELECT * FROM Carrinho WHERE ID_utilizador = ? AND ID_produto = ?`,
      [id_utilizador, id_produto]
    );

    if (existe.length > 0) {
      // Atualiza a quantidade
      await pool.query(
        `UPDATE Carrinho SET Quantidade = Quantidade + ? 
         WHERE ID_utilizador = ? AND ID_produto = ?`,
        [quantidade, id_utilizador, id_produto]
      );
    } else {
      // Insere novo item
      await pool.query(
        `INSERT INTO Carrinho (ID_utilizador, ID_produto, Quantidade) 
         VALUES (?, ?, ?)`,
        [id_utilizador, id_produto, quantidade]
      );
    }

    return res.status(200).json({ message: "Produto adicionado ao carrinho!" });
  } catch (err) {
    console.error("Erro ao adicionar ao carrinho:", err);
    return res.status(500).json({ message: "Erro no servidor" });
  }
}
