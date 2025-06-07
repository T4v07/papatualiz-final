import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const [produtos] = await pool.query(`
      SELECT p.ID_produto, p.Nome_Produtos, p.Modelo, p.Marca, p.Cor, p.Foto, p.Preco, 
             p.Tipo_de_Categoria, p.Descricao, p.Stock
      FROM Produtos p
      LEFT JOIN Categoria c ON p.Tipo_de_Categoria = c.ID_categoria
    `);

    res.status(200).json(produtos);
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
    res.status(500).json({ message: "Erro no servidor" });
  }
}
