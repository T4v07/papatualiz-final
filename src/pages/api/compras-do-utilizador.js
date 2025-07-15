import { pool } from "@/utils/db";

export default async function handler(req, res) {
  const { email } = req.query;

  if (!email) return res.status(400).json({ message: "Email é obrigatório" });

  try {
    // 1. Buscar utilizador
    const [userResult] = await pool.query(
      `SELECT ID_utilizador FROM Utilizador WHERE Email = ?`,
      [email]
    );
    const user = userResult[0];
    if (!user) return res.status(404).json([]);

    // 2. Buscar encomendas do utilizador
    const [encomendas] = await pool.query(
      `SELECT ID_compra, Estado, Data_criacao FROM Encomenda WHERE usuario_id = ? ORDER BY Data_criacao DESC`,
      [user.ID_utilizador]
    );

    // 3. Montar compras com produtos
    const compras = [];

    for (const encomenda of encomendas) {
      const [produtos] = await pool.query(
        `SELECT 
          COALESCE(p.Nome_Produtos, 'Produto desconhecido') AS Nome,
          (
            SELECT url 
            FROM ProdutoFotos 
            WHERE produto_id = p.ID_produto 
            ORDER BY ordem ASC LIMIT 1
          ) AS Imagem,
          cp.Quantidade,
          cp.Preco_unitario
         FROM Compra_Produto cp
         JOIN Produtos p ON cp.ID_produto = p.ID_produto
         WHERE cp.ID_compra = ?`,
        [encomenda.ID_compra]
      );

      if (produtos.length > 0) {
        compras.push({
          ID_compra: encomenda.ID_compra,
          Data_compra: encomenda.Data_criacao,        
          produtos,
          Total_Valor: produtos.reduce(
            (acc, p) => acc + p.Quantidade * p.Preco_unitario,
            0
          ),
        });
      }
    }

    res.status(200).json(compras);
  } catch (err) {
    console.error("Erro ao buscar compras:", err);
    res.status(500).json({ message: "Erro interno" });
  }
}
