import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "ID da compra inválido." });
  }

  try {
    const [result] = await pool.query(
      `UPDATE Encomenda SET Arquivado = 1 WHERE ID_compra = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Compra não encontrada." });
    }

    return res.status(200).json({ message: "Compra arquivada com sucesso." });
  } catch (error) {
    console.error("Erro ao arquivar compra:", error);
    return res.status(500).json({ message: "Erro interno ao arquivar compra." });
  }
}
