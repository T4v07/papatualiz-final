// /pages/api/produtos.js
import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const [produtos] = await pool.query(`
      SELECT 
        p.ID_produto, 
        p.Nome_Produtos, 
        p.Modelo, 
        p.Marca, 
        p.Preco, 
        c.Tipo_de_Categoria,
        p.Descricao,
        (
          SELECT pf.url 
          FROM ProdutoFotos pf 
          WHERE pf.produto_id = p.ID_produto
          LIMIT 1
        ) AS Foto
      FROM Produtos p
      LEFT JOIN Categoria c ON c.ID_categoria = p.Tipo_de_Categoria
      LIMIT 100
    `);

    // Opcional: buscar variantes para cada produto
    for (let produto of produtos) {
      const [variantes] = await pool.query(
        "SELECT id, cor, tamanho, stock FROM ProdutoVariacoes WHERE produto_id = ?",
        [produto.ID_produto]
      );
      produto.variantes = variantes;
    }

    res.status(200).json(produtos);
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
    res.status(500).json({ message: "Erro no servidor" });
  }
}
