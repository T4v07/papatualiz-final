import { pool } from "@/utils/db";

export default async function handler(req, res) {
  const usuarioId = req.headers["x-usuario-id"];

  console.log("ID do usuário recebido no carrinho:", usuarioId);

  if (!usuarioId) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }

  // Função para buscar o carrinho atualizado do usuário
  async function buscarCarrinho() {
    const [rows] = await pool.query(
      `SELECT
        c.ID_carrinho,
        c.Quantidade,
        p.ID_produto,
        p.Nome_Produtos,
        p.Preco,
        p.Marca,
        v.id AS id_variacao,
        v.tamanho AS Tamanho,
        v.cor AS Cor,
        (
          SELECT f.url
          FROM ProdutoFotos f
          WHERE f.produto_id = p.ID_produto
          ORDER BY f.ordem ASC
          LIMIT 1
        ) AS Foto
      FROM Carrinho c
      JOIN Produtos p ON c.ID_produto = p.ID_produto
      JOIN ProdutoVariacoes v ON v.id = c.ID_produto_variacao
      WHERE c.ID_utilizador = ?
      ORDER BY c.ID_carrinho DESC`,
      [usuarioId]
    );
    return rows;
  }

  if (req.method === "GET") {
    try {
      const carrinho = await buscarCarrinho();
      return res.status(200).json(carrinho);
    } catch (error) {
      console.error("Erro ao buscar carrinho:", error);
      return res.status(500).json({ message: "Erro ao buscar carrinho" });
    }
  }

  if (req.method === "POST") {
    const { ID_produto, ID_produto_variacao, quantidade } = req.body;

    if (!ID_produto || !ID_produto_variacao || !quantidade) {
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    try {
      const [[produto]] = await pool.query(
        "SELECT Preco FROM Produtos WHERE ID_produto = ?",
        [ID_produto]
      );

      if (!produto) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }

      const totalItem = quantidade * parseFloat(produto.Preco);

      const [rows] = await pool.query(
        `SELECT * FROM Carrinho 
         WHERE ID_utilizador = ? AND ID_produto = ? AND ID_produto_variacao = ?`,
        [usuarioId, ID_produto, ID_produto_variacao]
      );

      if (rows.length > 0) {
        const novaQuantidade = rows[0].Quantidade + quantidade;
        const novoTotal = novaQuantidade * parseFloat(produto.Preco);

        await pool.query(
          `UPDATE Carrinho 
           SET Quantidade = ?, Total = ? 
           WHERE ID_carrinho = ?`,
          [novaQuantidade, novoTotal, rows[0].ID_carrinho]
        );
      } else {
        await pool.query(
          `INSERT INTO Carrinho 
           (ID_utilizador, ID_produto, ID_produto_variacao, Quantidade, Total, estado) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [usuarioId, ID_produto, ID_produto_variacao, quantidade, totalItem, "pendente"]
        );
      }

      const carrinhoAtualizado = await buscarCarrinho();

      return res.status(200).json({ message: "Produto adicionado ao carrinho", carrinho: carrinhoAtualizado });
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      return res.status(500).json({ message: "Erro interno ao adicionar ao carrinho" });
    }
  }

  if (req.method === "PUT") {
    const { id_carrinho, quantidade } = req.body;
    if (!id_carrinho || !quantidade) {
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    try {
      const [[item]] = await pool.query(
        `SELECT c.ID_produto, p.Preco 
         FROM Carrinho c
         JOIN Produtos p ON c.ID_produto = p.ID_produto 
         WHERE c.ID_carrinho = ? AND c.ID_utilizador = ?`,
        [id_carrinho, usuarioId]
      );

      if (!item) {
        return res.status(404).json({ message: "Item não encontrado" });
      }

      const novoTotal = quantidade * parseFloat(item.Preco);

      await pool.query(
        `UPDATE Carrinho SET Quantidade = ?, Total = ? WHERE ID_carrinho = ?`,
        [quantidade, novoTotal, id_carrinho]
      );

      const carrinhoAtualizado = await buscarCarrinho();

      return res.status(200).json({ message: "Quantidade atualizada", carrinho: carrinhoAtualizado });
    } catch (error) {
      console.error("Erro ao atualizar item:", error);
      return res.status(500).json({ message: "Erro ao atualizar item do carrinho" });
    }
  }

  if (req.method === "DELETE") {
    const { id_carrinho } = req.body;
    if (!id_carrinho) {
      return res.status(400).json({ message: "ID do carrinho é obrigatório" });
    }

    try {
      await pool.query(
        `DELETE FROM Carrinho WHERE ID_carrinho = ? AND ID_utilizador = ?`,
        [id_carrinho, usuarioId]
      );

      const carrinhoAtualizado = await buscarCarrinho();

      return res.status(200).json({ message: "Item removido com sucesso", carrinho: carrinhoAtualizado });
    } catch (error) {
      console.error("Erro ao remover item:", error);
      return res.status(500).json({ message: "Erro ao remover item do carrinho" });
    }
  }

  return res.status(405).json({ message: "Método não permitido" });
}
