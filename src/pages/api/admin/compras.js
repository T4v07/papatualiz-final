import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  try {
    const [compras] = await pool.query(`
      SELECT c.ID_compra, c.Data_compra, c.Total_Valor, u.Nome AS Nome_Cliente
      FROM Compra c
      JOIN Utilizador u ON c.ID_utilizador = u.ID_utilizador
      ORDER BY c.Data_compra DESC
    `);

    const [produtos] = await pool.query(`
      SELECT 
        cp.ID_compra,
        cp.ID_produto,
        p.Nome_Produtos,
        p.Foto,
        p.Preco,
        cp.Quantidade
      FROM Compra_Produto cp
      JOIN Produtos p ON cp.ID_produto = p.ID_produto
    `);

    const comprasComProdutos = compras.map((compra) => {
      const produtosDaCompra = produtos.filter(p => p.ID_compra === compra.ID_compra);
      return { ...compra, produtos: produtosDaCompra };
    });

    res.status(200).json(comprasComProdutos);
  } catch (err) {
    console.error("Erro ao buscar compras:", err);
    res.status(500).json({ message: "Erro ao buscar compras." });
  }
}
