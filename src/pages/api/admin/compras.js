import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  try {
    const {
      dataInicio,
      dataFim,
      valorMin,
      valorMax,
      pagina = 1,
      porPagina = 10,
      incluirArquivadas,
    } = req.query;

    const offset = (pagina - 1) * porPagina;

    // Filtros dinâmicos
    let filtros = [];
    let params = [];

    if (dataInicio) {
      filtros.push("e.Data_criacao >= ?");
      params.push(`${dataInicio} 00:00:00`);
    }
    if (dataFim) {
      filtros.push("e.Data_criacao <= ?");
      params.push(`${dataFim} 23:59:59`);
    }
    if (valorMin) {
      filtros.push("e.Total_Valor >= ?");
      params.push(valorMin);
    }
    if (valorMax) {
      filtros.push("e.Total_Valor <= ?");
      params.push(valorMax);
    }

    // Filtro para arquivadas
    if (!incluirArquivadas || incluirArquivadas === "false") {
      filtros.push("(e.Arquivado IS NULL OR e.Arquivado = 0)");
    }

    const whereClause = filtros.length ? `WHERE ${filtros.join(" AND ")}` : "";

    // Totalizador
    const [[{ totalCompras }]] = await pool.query(
      `SELECT COUNT(*) as totalCompras FROM Encomenda e ${whereClause}`,
      params
    );

    // Encomendas com paginação
    const [encomendas] = await pool.query(
      `
      SELECT 
        e.ID_encomenda,
        e.ID_compra,
        e.Data_criacao,
        e.Total_Valor,
        u.Nome AS Nome_Cliente
      FROM Encomenda e
      JOIN Utilizador u ON e.usuario_id = u.ID_utilizador
      ${whereClause}
      ORDER BY e.Data_criacao DESC
      LIMIT ? OFFSET ?
      `,
      [...params, Number(porPagina), Number(offset)]
    );

    // Produtos da compra
    const [produtos] = await pool.query(
      `
      SELECT 
        cp.ID_compra,
        cp.ID_produto,
        p.Nome_Produtos,
        COALESCE(
          (SELECT url FROM ProdutoFotos WHERE produto_id = p.ID_produto LIMIT 1),
          NULL
        ) AS Foto,
        cp.Preco_unitario AS Preco,
        cp.Quantidade
      FROM Compra_Produto cp
      JOIN Produtos p ON cp.ID_produto = p.ID_produto
      `
    );

    const comprasComProdutos = encomendas.map((enc) => {
      const produtosDaCompra = produtos.filter(p => p.ID_compra === enc.ID_compra);
      return { ...enc, produtos: produtosDaCompra };
    });

    res.status(200).json({
      totalCompras,
      pagina: Number(pagina),
      porPagina: Number(porPagina),
      compras: comprasComProdutos,
    });

  } catch (err) {
    console.error("Erro ao buscar compras:", err);
    res.status(500).json({ message: "Erro ao buscar compras." });
  }
}
