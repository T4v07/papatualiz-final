// /pages/api/encomendas/listar.js
import { pool } from "@/utils/db";

export default async function handler(req, res) {
  try {
    const {
      estado,
      arquivado,
      busca,
      dataInicio,
      dataFim,
      valorMin,
      valorMax,
      page = 1,
      limit = 10
    } = req.query;

    const filtros = [];
    const params = [];

    if (estado && estado !== "todos") {
      filtros.push("e.Estado = ?");
      params.push(estado);
    }

    if (arquivado === "true") {
      filtros.push("e.Arquivado = 1");
    } else if (arquivado === "false") {
      filtros.push("e.Arquivado = 0");
    }

    if (busca && busca.trim() !== "") {
      const b = `%${busca.trim()}%`;
      filtros.push(`(
        e.nome LIKE ? OR
        e.apelido LIKE ? OR
        e.email LIKE ? OR
        e.ID_encomenda LIKE ?
      )`);
      params.push(b, b, b, b);
    }

    if (dataInicio) {
      filtros.push("e.Data_criacao >= ?");
      params.push(dataInicio);
    }
    if (dataFim) {
      filtros.push("e.Data_criacao <= ?");
      params.push(dataFim);
    }

    if (valorMin) {
      filtros.push("e.Total_Valor >= ?");
      params.push(valorMin);
    }
    if (valorMax) {
      filtros.push("e.Total_Valor <= ?");
      params.push(valorMax);
    }

    const whereClause = filtros.length > 0 ? `WHERE ${filtros.join(" AND ")}` : "";

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const limitInt = parseInt(limit);

    // Buscar total de registros para paginação
    const [contagem] = await pool.query(`
      SELECT COUNT(*) AS total
      FROM Encomenda e
      ${whereClause}
    `, params);
    const total = contagem[0].total;
    const totalPages = Math.ceil(total / limitInt);

    // Buscar encomendas
    const [encomendas] = await pool.query(`
      SELECT 
        e.ID_encomenda, e.ID_compra, e.Estado, e.Data_criacao,
        e.nome, e.apelido, e.email, e.telefone,
        e.Rua, e.Numero, e.Codigo_postal, e.Cidade, e.Pais,
        e.Subtotal, e.Frete, e.Total_Valor, e.Arquivado
      FROM Encomenda e
      ${whereClause}
      ORDER BY e.ID_encomenda DESC
      LIMIT ? OFFSET ?
    `, [...params, limitInt, offset]);

    const resultadoFinal = [];

    for (const encomenda of encomendas) {
      const [produtos] = await pool.query(`
        SELECT 
          cp.ID_produto, cp.Quantidade, cp.Preco_unitario,
          p.Nome_Produtos, p.Marca,
          pv.cor, pv.tamanho,
          (
            SELECT url
            FROM ProdutoFotos pf
            WHERE pf.produto_id = p.ID_produto
            LIMIT 1
          ) AS url
        FROM Compra_Produto cp
        JOIN Produtos p ON cp.ID_produto = p.ID_produto
        LEFT JOIN ProdutoVariacoes pv ON cp.ID_produto_variacao = pv.id
        WHERE cp.ID_compra = ?
      `, [encomenda.ID_compra]);

      resultadoFinal.push({
        ...encomenda,
        Produtos: produtos
      });
    }

    res.status(200).json({
      encomendas: resultadoFinal,
      totalPages
    });

  } catch (err) {
    console.error("Erro ao listar encomendas:", err);
    res.status(500).json({ message: "Erro interno ao listar encomendas" });
  }
}
