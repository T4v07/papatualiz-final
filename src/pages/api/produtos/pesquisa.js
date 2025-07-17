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
    // 🔍 Função de limpeza avançada com remoção de preposições
    const limpar = (str) =>
      str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/gi, "")
        .split(" ")
        .filter(
          (palavra) =>
            palavra &&
            !["de", "da", "do", "e", "a", "o", "os", "as", "com", "para"].includes(palavra)
        );

    const palavras = limpar(q);

    if (palavras.length === 0) {
      return res.status(200).json([]);
    }

    const conditions = palavras
      .map(() => `
        (
          p.Nome_Produtos LIKE ? OR 
          p.Marca LIKE ? OR 
          p.Modelo LIKE ? OR
          p.Material LIKE ? OR
          p.Tecnologia LIKE ? OR
          p.Descricao LIKE ? OR
          c.Tipo_de_Categoria LIKE ?
        )
      `)
      .join(" OR ");

    const params = palavras.flatMap((palavra) => {
      const like = `%${palavra}%`;
      return [like, like, like, like, like, like, like];
    });

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
      WHERE (${conditions}) AND p.Ativo = 1
      `,
      params
    );

    if (produtos.length === 0) {
      return res.status(200).json([]);
    }

    const ids = produtos.map((p) => p.ID_produto);

    const [variacoes] = await pool.query(
      `SELECT * FROM ProdutoVariacoes WHERE produto_id IN (${ids.map(() => "?").join(",")})`,
      ids
    );

    const [fotos] = await pool.query(
      `SELECT * FROM ProdutoFotos WHERE produto_id IN (${ids.map(() => "?").join(",")}) ORDER BY ordem ASC`,
      ids
    );

    const produtosComDetalhes = produtos.map((produto) => ({
      ...produto,
      variacoes: variacoes.filter((v) => v.produto_id === produto.ID_produto),
      fotos: fotos.filter((f) => f.produto_id === produto.ID_produto),
    }));

    res.status(200).json(produtosComDetalhes);
  } catch (error) {
    console.error("❌ ERRO MYSQL:", error);
    res.status(500).json({ message: "Erro interno ao buscar produtos", erro: error.message });
  }
}
