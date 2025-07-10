import { pool } from "@/utils/db";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) return res.status(400).json({ message: "ID da compra é obrigatório" });

  try {
    // Busca produtos da compra com a imagem principal (ordem = 1)
    const [produtos] = await pool.query(
      `
      SELECT 
        p.ID_produto,
        p.Nome_Produtos AS Nome,
        pf.url AS Imagem,
        cp.Quantidade,
        cp.Preco_unitario
      FROM Compra_Produto cp
      JOIN Produtos p ON cp.ID_produto = p.ID_produto
      LEFT JOIN ProdutoFotos pf ON p.ID_produto = pf.produto_id AND pf.ordem = 1
      WHERE cp.ID_compra = ?
      `,
      [id]
    );

    // Busca dados da encomenda
    const [encomendaResult] = await pool.query(
      `
      SELECT * FROM Encomenda WHERE ID_compra = ?
      `,
      [id]
    );

    const encomenda = encomendaResult[0] || null;

    res.status(200).json({
      ID_compra: id,
      produtos,
      encomenda,
    });
  } catch (err) {
    console.error("Erro ao buscar detalhes da compra:", err);
    res.status(500).json({ message: "Erro ao buscar detalhes da compra" });
  }
}
