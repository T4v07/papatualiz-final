// /pages/api/admin/variacoes.js
import { pool } from "@/utils/db";

export default async function handler(req, res) {
  // GET: Listar variações por produto_id
  if (req.method === "GET") {
    const { produto_id } = req.query;

    if (!produto_id) {
      return res.status(400).json({ message: "ID do produto é obrigatório" });
    }

    try {
      const [rows] = await pool.query(
        "SELECT id, cor, tamanho, stock FROM ProdutoVariacoes WHERE produto_id = ? ORDER BY id ASC",
        [produto_id]
      );
      return res.status(200).json(rows);
    } catch (err) {
      console.error("Erro ao buscar variações:", err);
      return res.status(500).json({ message: "Erro ao buscar variações" });
    }
  }

  // PUT: Atualizar lista de variações (sobrescreve)
  if (req.method === "PUT") {
    const { produto_id, variacoes } = req.body;

    if (!produto_id || !Array.isArray(variacoes)) {
      return res.status(400).json({ message: "Dados inválidos" });
    }

    const conn = await pool.getConnection();
    await conn.beginTransaction();

    try {
      // Remove todas as variações anteriores
      await conn.query("DELETE FROM ProdutoVariacoes WHERE produto_id = ?", [produto_id]);

      // Insere novamente
      for (const v of variacoes) {
        const { cor, tamanho, stock } = v;
        if (cor && tamanho) {
          await conn.query(
            "INSERT INTO ProdutoVariacoes (produto_id, cor, tamanho, stock) VALUES (?, ?, ?, ?)",
            [produto_id, cor, tamanho, stock ?? 0]
          );
        }
      }

      await conn.commit();
      conn.release();
      return res.status(200).json({ message: "Variações atualizadas com sucesso" });
    } catch (err) {
      await conn.rollback();
      conn.release();
      console.error("Erro ao atualizar variações:", err);
      return res.status(500).json({ message: "Erro ao atualizar variações" });
    }
  }

  // Método não permitido
  res.status(405).json({ message: "Método não permitido" });
}
