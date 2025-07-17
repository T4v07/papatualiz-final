import { pool } from "@/utils/db";

export default async function handler(req, res) {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.status(400).json({ error: "Query de pesquisa ausente" });
  }

  const termo = `%${q.trim()}%`;

  try {
    // Sugestões de texto (nomes de produtos)
    const [sugestoes] = await pool.query(
      `SELECT DISTINCT Nome_Produtos 
       FROM Produtos 
       WHERE Ativo = 1 AND Nome_Produtos LIKE ?
       ORDER BY Nome_Produtos ASC 
       LIMIT 5`,
      [termo]
    );

    const sugestoesPesquisa = sugestoes.map((s) => s.Nome_Produtos);

    // Produtos
    const [produtos] = await pool.query(
      `SELECT 
         P.ID_produto, 
         P.Nome_Produtos, 
         P.Marca, 
         P.Preco, 
         P.Desconto, 
         MIN(PF.url) AS url
       FROM Produtos P
       LEFT JOIN ProdutoFotos PF ON PF.produto_id = P.ID_produto
       WHERE P.Ativo = 1 AND P.Nome_Produtos LIKE ?
       GROUP BY P.ID_produto, P.Nome_Produtos, P.Marca, P.Preco, P.Desconto
       ORDER BY P.Data_Criacao DESC
       LIMIT 4`,
      [termo]
    );

    res.status(200).json({ sugestoesPesquisa, produtos });

  } catch (error) {
    console.error("Erro ao buscar sugestões:", error);
    res.status(500).json({ error: "Erro ao buscar sugestões" });
  }
}
