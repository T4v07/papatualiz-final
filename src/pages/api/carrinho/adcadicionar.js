// /api/carrinho/adcadicionar.js
import { pool } from "@/utils/db";

export default async function handler(req, res) {
  console.log("Método recebido:", req.method);
  console.log("Headers:", req.headers);
  console.log("Body recebido:", req.body);

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const usuarioId = req.headers["x-usuario-id"];
  if (!usuarioId) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }

  const { ID_produto, ID_produto_variacao, quantidade } = req.body;

  if (!ID_produto || !ID_produto_variacao || !quantidade) {
    return res.status(400).json({ message: "Campos obrigatórios ausentes." });
  }

  try {
    // Busca o preço do produto
    const [[produto]] = await pool.query(
      "SELECT Preco FROM Produtos WHERE ID_produto = ?",
      [ID_produto]
    );

    if (!produto) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    const totalItem = quantidade * parseFloat(produto.Preco);

    // Verifica se o item já existe no carrinho para o usuário
    const [rows] = await pool.query(
      `SELECT * FROM Carrinho 
       WHERE ID_utilizador = ? AND ID_produto = ? AND ID_produto_variacao = ?`,
      [usuarioId, ID_produto, ID_produto_variacao]
    );

    if (rows.length > 0) {
      // Atualiza quantidade e total do item existente
      const novaQuantidade = rows[0].Quantidade + quantidade;
      const novoTotal = novaQuantidade * parseFloat(produto.Preco);

      await pool.query(
        `UPDATE Carrinho 
         SET Quantidade = ?, Total = ? 
         WHERE ID_carrinho = ?`,
        [novaQuantidade, novoTotal, rows[0].ID_carrinho]
      );
    } else {
      // Insere novo item no carrinho
      await pool.query(
        `INSERT INTO Carrinho 
         (ID_utilizador, ID_produto, ID_produto_variacao, Quantidade, Total, estado) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [usuarioId, ID_produto, ID_produto_variacao, quantidade, totalItem, "pendente"]
      );
    }

    return res.status(200).json({ message: "Produto adicionado ao carrinho" });
  } catch (error) {
    console.error("Erro ao adicionar ao carrinho:", error);
    return res.status(500).json({ message: "Erro interno ao adicionar ao carrinho" });
  }
}
