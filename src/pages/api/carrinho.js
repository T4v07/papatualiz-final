// /pages/api/carrinho.js
import { pool } from "@/utils/db"; // 👈 ESSA LINHA É O QUE FALTAVA!

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { id_utilizador } = req.query;
  console.log("ID RECEBIDO:", id_utilizador);

  if (!id_utilizador) {
    return res.status(400).json({ message: "ID do utilizador é obrigatório" });
  }

  try {
    const [rows] = await pool.query(
      `SELECT c.ID_carrinho, c.Quantidade, c.ID_produto,
              p.Nome_Produtos, p.Preco, p.Foto, p.Marca
       FROM Carrinho c
       JOIN Produtos p ON c.ID_produto = p.ID_produto
       WHERE c.ID_utilizador = ?`,
      [id_utilizador]
    );

    console.log("RESULTADO DA QUERY:", rows);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Erro ao buscar carrinho:", err);
    res.status(500).json({ message: "Erro no servidor" });
  }
}
