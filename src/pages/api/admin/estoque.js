// /pages/api/admin/estoque.js
import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const [rows] = await pool.query(
        "SELECT ID_produto, Nome_Produtos, Marca, Stock FROM Produtos"
      );
      return res.status(200).json(rows);
    } catch (err) {
      console.error("Erro ao buscar estoque:", err);
      return res.status(500).json({ message: "Erro ao buscar produtos" });
    }
  }

  if (req.method === "PUT") {
    const { id_produto, novo_stock } = req.body;

    if (!id_produto || novo_stock === undefined) {
      return res.status(400).json({ message: "Dados inválidos" });
    }

    try {
      await pool.query("UPDATE Produtos SET Stock = ? WHERE ID_produto = ?", [
        novo_stock,
        id_produto,
      ]);
      return res.status(200).json({ message: "Stock atualizado com sucesso" });
    } catch (err) {
      console.error("Erro ao atualizar stock:", err);
      return res.status(500).json({ message: "Erro ao atualizar stock" });
    }
  }

  res.status(405).json({ message: "Método não permitido" });
}
