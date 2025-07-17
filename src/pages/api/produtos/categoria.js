import { pool } from "@/utils/db";

export default async function handler(req, res) {
  const { tipoCategoria } = req.query;

  if (!tipoCategoria) {
    return res.status(400).json({ erro: "Categoria não especificada." });
  }

  try {
    // 1. Buscar todos os IDs das subcategorias com esse nome
    const [subcategorias] = await pool.query(
      `SELECT ID_categoria FROM Categoria WHERE Tipo_de_Categoria = ?`,
      [tipoCategoria]
    );

    if (subcategorias.length === 0) {
      return res.status(404).json({ erro: "Categoria não encontrada." });
    }

    const ids = subcategorias.map((cat) => cat.ID_categoria);

    // 2. Buscar os produtos ativos dessas categorias
    const [produtos] = await pool.query(
      `SELECT 
        p.ID_produto AS id,
        p.Nome_Produtos AS nome,
        p.Marca AS marca,
        p.Preco AS preco,
        p.Desconto AS desconto,
        p.Novo AS novo
      FROM Produtos p
      WHERE p.Ativo = 1 AND p.Tipo_de_Categoria IN (?)
      ORDER BY RAND()
      LIMIT 6`,
      [ids]
    );

    const produtoIds = produtos.map((p) => p.id);

    // 3. Buscar os stocks totais para cada produto
    const [stocks] = await pool.query(
      `SELECT produto_id, SUM(stock) AS total 
       FROM ProdutoVariacoes 
       WHERE produto_id IN (?) 
       GROUP BY produto_id`,
      [produtoIds]
    );

    const mapaStock = {};
    stocks.forEach((s) => {
      mapaStock[s.produto_id] = s.total;
    });

    // 4. Construir a resposta final
    const resultados = await Promise.all(
      produtos.map(async (produto) => {
        const [fotos] = await pool.query(
          `SELECT url FROM ProdutoFotos WHERE produto_id = ? LIMIT 1`,
          [produto.id]
        );

        const imagem = fotos.length > 0 ? fotos[0].url : null;
        const stockTotal = mapaStock[produto.id] || 0;

        const precoOriginal =
          produto.desconto && Number(produto.desconto) > 0
            ? `${Number(produto.preco).toFixed(2)}€`
            : null;

        const precoFinal =
          produto.desconto && Number(produto.desconto) > 0
            ? `${(Number(produto.preco) - Number(produto.desconto)).toFixed(2)}€`
            : `${Number(produto.preco).toFixed(2)}€`;

        return {
          id: produto.id,
          nome: produto.nome,
          marca: produto.marca,
          imagem,
          precoOriginal,
          precoFinal,
          novo: produto.novo === 1,
          stock: stockTotal,
        };
      })
    );

    res.status(200).json(resultados);
  } catch (erro) {
    console.error("Erro ao buscar produtos por categoria:", erro);
    res.status(500).json({ erro: "Erro interno do servidor." });
  }
}
