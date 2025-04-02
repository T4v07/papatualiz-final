import { pool } from "@/utils/db";

export default async function handler(req, res) {
  const { termo = "", marca = "", cor = "", categoria = "" } = req.query;

  try {
    const [result] = await pool.query(
      `SELECT p.ID_produto, p.Nome_Produtos, p.Modelo, p.Marca, p.Cor, p.Foto, p.Preco, p.Tipo_de_Categoria, p.Descricao, p.Stock
       FROM Produtos p
       LEFT JOIN Categoria c ON p.Tipo_de_Categoria = c.ID_categoria
       WHERE 
         (p.Nome_Produtos LIKE ? OR p.Marca LIKE ? OR p.Descricao LIKE ?)
         AND (p.Marca = ? OR ? = '')
         AND (p.Cor = ? OR ? = '')
         AND (p.Tipo_de_Categoria = ? OR ? = '')`,
      [
        `%${termo}%`,
        `%${termo}%`,
        `%${termo}%`,
        marca, marca,
        cor, cor,
        categoria, categoria,
      ]
    );

    res.status(200).json(result);
  } catch (err) {
    console.error("Erro ao pesquisar:", err);
    res.status(500).json({ message: "Erro no servidor" });
  }
}
