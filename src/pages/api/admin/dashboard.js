// /api/admin/dashboard.js
import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido." });
  }

  try {
    const { dataInicio, dataFim, estado } = req.query;

    const whereClausulas = [];
    const values = [];

    if (dataInicio) {
      whereClausulas.push("Data_criacao >= ?");
      values.push(dataInicio);
    }

    if (dataFim) {
      whereClausulas.push("Data_criacao <= ?");
      values.push(dataFim);
    }

    if (estado) {
      whereClausulas.push("Estado = ?");
      values.push(estado);
    }

    const whereSQL = whereClausulas.length > 0 ? `WHERE ${whereClausulas.join(" AND ")}` : "";

    // Totais independentes de filtros
    const [users] = await pool.query(`SELECT COUNT(*) AS totalUsers FROM Utilizador`);
    const [products] = await pool.query(`SELECT COUNT(*) AS totalProducts FROM Produtos`);
    const [sales] = await pool.query(`SELECT SUM(Total_Valor) AS totalSales FROM Encomenda`);
    const [discounted] = await pool.query(`SELECT COUNT(*) AS count FROM Produtos WHERE Desconto > 0`);
    const [lowStock] = await pool.query(`
      SELECT COUNT(DISTINCT produto_id) AS count
      FROM ProdutoVariacoes
      WHERE stock <= 5
    `);
    const [recent] = await pool.query(`
      SELECT COUNT(*) AS count FROM Produtos
      WHERE Data_Criacao >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `);

    const [novosRegistosRaw] = await pool.query(`
      SELECT DATE_FORMAT(DataRegistro, '%Y-%m') AS mes, COUNT(*) AS total
      FROM Utilizador
      WHERE DataRegistro >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY mes
      ORDER BY mes ASC
    `);

    // Gráficos filtrados
    const [salesByMonthRaw] = await pool.query(`
      SELECT DATE_FORMAT(Data_criacao, '%Y-%m') AS month, SUM(Total_Valor) AS total
      FROM Encomenda
      ${whereSQL}
      GROUP BY month
      ORDER BY month ASC
    `, values);

    const [faturacaoMensalRaw] = await pool.query(`
      SELECT DATE_FORMAT(Data_criacao, '%Y-%m') AS mes, SUM(Total_Valor) AS total
      FROM Encomenda
      ${whereSQL}
      GROUP BY mes
      ORDER BY mes ASC
    `, values);

    const [ordersByStateRaw] = await pool.query(`
      SELECT Estado, COUNT(*) AS count
      FROM Encomenda
      ${whereSQL}
      GROUP BY Estado
    `, values);

    const [productsByCategoryRaw] = await pool.query(`
      SELECT c.Tipo_de_Categoria AS categoria, COUNT(p.ID_produto) AS count
      FROM Produtos p
      JOIN Categoria c ON p.Tipo_de_Categoria = c.ID_categoria
      GROUP BY c.Tipo_de_Categoria
    `);

    const [latestOrdersRaw] = await pool.query(`
      SELECT ID_encomenda, Estado, Data_criacao, Total_Valor, nome AS Nome, ID_compra
      FROM Encomenda
      ${whereSQL}
      ORDER BY Data_criacao DESC
      LIMIT 5
    `, values);

    const encomendaIds = latestOrdersRaw.map(e => e.ID_encomenda);
    let produtosMap = {};

    if (encomendaIds.length > 0) {
      const [produtosRaw] = await pool.query(`
        SELECT e.ID_encomenda, p.Nome_Produtos AS nome, pv.cor, pv.tamanho, cp.Quantidade AS quantidade
        FROM Encomenda e
        JOIN Compra_Produto cp ON e.ID_compra = cp.ID_compra
        JOIN Produtos p ON cp.ID_produto = p.ID_produto
        JOIN ProdutoVariacoes pv ON cp.ID_produto_variacao = pv.id
        WHERE e.ID_encomenda IN (?)
      `, [encomendaIds]);

      for (const item of produtosRaw) {
        const id = item.ID_encomenda;
        if (!produtosMap[id]) produtosMap[id] = [];
        produtosMap[id].push({
          nome: item.nome,
          cor: item.cor,
          tamanho: item.tamanho,
          quantidade: item.quantidade,
        });
      }
    }

    const latestOrders = latestOrdersRaw.map(order => ({
      ...order,
      Produtos: produtosMap[order.ID_encomenda] || []
    }));

    const [topProdutosVendidos] = await pool.query(`
      SELECT p.Nome_Produtos AS nome, SUM(cp.Quantidade) AS totalVendido
      FROM Compra_Produto cp
      JOIN Encomenda e ON cp.ID_compra = e.ID_compra
      JOIN Produtos p ON cp.ID_produto = p.ID_produto
      ${whereSQL}
      GROUP BY cp.ID_produto
      ORDER BY totalVendido DESC
      LIMIT 5
    `, values);

    return res.status(200).json({
      totalUsers: users[0]?.totalUsers || 0,
      totalProducts: products[0]?.totalProducts || 0,
      totalSales: Number(sales[0]?.totalSales) || 0,
      productsWithDiscount: discounted[0]?.count || 0,
      lowStock: lowStock[0]?.count || 0,
      recentProducts: recent[0]?.count || 0,
      salesByMonth: Array.isArray(salesByMonthRaw) ? salesByMonthRaw : [],
      faturacaoMensal: Array.isArray(faturacaoMensalRaw) ? faturacaoMensalRaw : [],
      ordersByState: Array.isArray(ordersByStateRaw) ? ordersByStateRaw : [],
      productsByCategory: Array.isArray(productsByCategoryRaw) ? productsByCategoryRaw : [],
      latestOrders,
      topProdutosVendidos: Array.isArray(topProdutosVendidos) ? topProdutosVendidos : [],
      novosRegistosPorMes: Array.isArray(novosRegistosRaw) ? novosRegistosRaw : [],
    });
  } catch (error) {
    console.error("Erro ao obter dados da dashboard:", error);
    return res.status(500).json({ message: "Erro ao buscar dados da dashboard." });
  }
}
