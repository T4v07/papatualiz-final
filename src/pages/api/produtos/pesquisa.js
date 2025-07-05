// pages/api/produtos/pesquisa.js
import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.status(400).json({ message: "Parâmetro de pesquisa inválido" });
  }

  try {
    const termo = `%${q}%`;

    // Buscar produtos básicos sem coluna Cor (variações à parte)
    const [produtos] = await pool.query(
      `
      SELECT 
        p.ID_produto,
        p.Nome_Produtos,
        p.Modelo,
        p.Marca,
        p.Genero,
        p.Idade,
        p.Foto,
        p.Preco,
        p.Peso,
        p.Descricao,
        p.Tipo_de_Categoria,
        p.Ficha_Tecnica,
        p.Material,
        p.Material_Outro,
        p.Uso_Recomendado,
        p.Garantia,
        p.Tecnologia,
        p.Origem,
        p.Desconto,
        p.Novo AS Novidade,
        p.Cor_Outro,
        p.Idade_Outro,
        p.Tecnologia_Outro,
        p.Origem_Outro,
        p.Ativo,
        p.MarcaOutro,
        p.GeneroOutro,
        p.Data_Criacao,
        c.Tipo_de_Categoria AS NomeCategoria
      FROM Produtos p
      LEFT JOIN Categoria c ON p.Tipo_de_Categoria = c.ID_categoria
      WHERE 
        p.Nome_Produtos LIKE ? OR 
        p.Marca LIKE ? OR 
        p.Modelo LIKE ? OR
        p.Material LIKE ? OR
        p.Tecnologia LIKE ? OR
        p.Descricao LIKE ? OR
        c.Tipo_de_Categoria LIKE ?
      `,
      [termo, termo, termo, termo, termo, termo, termo]
    );

    if (produtos.length === 0) {
      return res.status(200).json([]);
    }

    // Obter IDs dos produtos para buscar variações e fotos
    const ids = produtos.map((p) => p.ID_produto);

    // Buscar variações (cores, tamanhos, stock) dos produtos
    const [variacoes] = await pool.query(
      `SELECT * FROM ProdutoVariacoes WHERE produto_id IN (${ids.map(() => "?").join(",")})`,
      ids
    );

    // Buscar fotos dos produtos
    const [fotos] = await pool.query(
      `SELECT * FROM ProdutoFotos WHERE produto_id IN (${ids.map(() => "?").join(",")}) ORDER BY ordem ASC`,
      ids
    );

    // Agregar variações e fotos dentro de cada produto
    const produtosComDetalhes = produtos.map((produto) => {
      return {
        ...produto,
        variacoes: variacoes.filter((v) => v.produto_id === produto.ID_produto),
        fotos: fotos.filter((f) => f.produto_id === produto.ID_produto),
      };
    });

    res.status(200).json(produtosComDetalhes);
  } catch (error) {
    console.error("❌ ERRO MYSQL:", error);
    res.status(500).json({ message: "Erro interno ao buscar produtos", erro: error.message });
  }
}
