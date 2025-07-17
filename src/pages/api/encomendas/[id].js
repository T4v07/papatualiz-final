// /api/encomendas/[id].js
import { pool } from "@/utils/db";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ mensagem: "Método não permitido" });
  }

  if (!id) {
    return res.status(400).json({ mensagem: "ID da encomenda é obrigatório" });
  }

  try {
    // Buscar dados da encomenda com os campos necessários
    const [encomendaRows] = await pool.execute(
      `SELECT 
         ID_compra, 
         Estado, 
         Codigo_rastreio, 
         Endereco_entrega, 
         Notas, 
         Data_criacao AS Data_compra, 
         nome, 
         apelido, 
         telefone, 
         email,
         Subtotal,
         Frete,
         Desconto,
         Total_Valor
       FROM Encomenda 
       WHERE ID_compra = ?`,
      [id]
    );

    if (encomendaRows.length === 0) {
      return res.status(404).json({ mensagem: "Encomenda não encontrada" });
    }

    const encomenda = encomendaRows[0];

    // Buscar produtos da encomenda com a imagem principal
    const [produtos] = await pool.execute(
      `SELECT
         cp.ID_produto,
         cp.Quantidade,
         cp.Preco_unitario,
         p.Nome_Produtos AS nome,
         pf.url AS imagem
       FROM Compra_Produto cp
       JOIN Produtos p ON cp.ID_produto = p.ID_produto
       LEFT JOIN ProdutoFotos pf 
         ON cp.ID_produto = pf.produto_id AND pf.ordem = 1
       WHERE cp.ID_compra = ?`,
      [id]
    );

    res.status(200).json({ encomenda, produtos });
  } catch (error) {
    console.error("Erro ao buscar encomenda:", error);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
}
