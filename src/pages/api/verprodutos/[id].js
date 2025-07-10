import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { id } = req.query;

  try {
    const [produtos] = await pool.execute(`
      SELECT p.*, c.Tipo_de_Produto, c.Tipo_de_Categoria
      FROM Produtos p
      JOIN Categoria c ON p.Tipo_de_Categoria = c.ID_categoria
      WHERE p.ID_produto = ?
    `, [id]);

    if (produtos.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    const produto = produtos[0];

    // Buscar variantes com ID correto
    const [variantesRaw] = await pool.execute(`
      SELECT id AS ID_produto_variacao, cor, tamanho, stock
      FROM ProdutoVariacoes
      WHERE produto_id = ?
    `, [id]);

    const variantes = [];

    variantesRaw.forEach(v => {
      v.tamanho.split(",").forEach(t => {
        variantes.push({
          ID_produto_variacao: v.ID_produto_variacao,
          cor: v.cor,
          tamanho: t.trim(),
          stock: v.stock, // se quiseres fazer por tamanho individual, isso vai mudar aqui depois
        });
      });
    });

    const [fotos] = await pool.execute(`
      SELECT url
      FROM ProdutoFotos
      WHERE produto_id = ?
      ORDER BY ordem ASC
    `, [id]);

    res.status(200).json({
      ...produto,
      variantes,
      fotos,
    });
  } catch (error) {
    console.error("Erro na API de produto por ID:", error);
    res.status(500).json({ message: 'Erro ao buscar produto' });
  }
}
