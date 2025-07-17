import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { termo } = req.query;

  if (!termo || termo.trim() === "") {
    return res.status(400).json({ message: "Termo de pesquisa inválido" });
  }

  try {
    // 🔎 Normaliza e separa termos por palavra
    const termosSeparados = termo
      .toLowerCase()
      .replace(/[^a-zA-Z0-9À-ÿ\s]/g, "")
      .split(" ")
      .filter(Boolean);

    if (termosSeparados.length === 0) {
      return res.status(400).json({ message: "Sem termos válidos" });
    }

    // Cria a cláusula dinâmica do WHERE (ex: campo LIKE ? AND campo LIKE ?)
    const clausulas = termosSeparados
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
      .join(" AND ");

    const valores = termosSeparados.flatMap((t) => {
      const likeTerm = `%${t}%`;
      return [likeTerm, likeTerm, likeTerm, likeTerm, likeTerm, likeTerm, likeTerm];
    });

    // 🔍 Query principal
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
      WHERE ${clausulas}
      `,
      valores
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
