import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { id_utilizador } = req.query;

    if (!id_utilizador) {
      return res.status(400).json({ message: "ID do utilizador é obrigatório" });
    }

    try {
      const [rows] = await pool.query(
        `SELECT 
          c.ID_carrinho, 
          c.Quantidade, 
          p.ID_produto,
          p.Nome_Produtos AS nome,
          p.Preco AS preco,
          p.Foto AS foto,
          p.Marca AS marca,
          p.Cor AS cor,
          p.Genero AS genero,
          p.Tamanho AS tamanho
        FROM Carrinho c
        JOIN Produtos p ON c.ID_produto = p.ID_produto
        WHERE c.ID_utilizador = ?`,
        [id_utilizador]
      );

      return res.status(200).json(rows);
    } catch (err) {
      console.error("Erro ao buscar carrinho:", err);
      return res.status(500).json({ message: "Erro interno ao buscar carrinho" });
    }
  }

  return res.status(405).json({ message: "Método não permitido" });
}
