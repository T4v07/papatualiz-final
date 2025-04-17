// /pages/api/encomendas/atualizar.js
import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { id, novoEstado } = req.body;

  if (!id || !novoEstado) {
    return res.status(400).json({ message: "Dados inválidos" });
  }

  try {
    await pool.query(
      "UPDATE Encomenda SET Estado = ? WHERE ID_encomenda = ?",
      [novoEstado, id]
    );

    return res.status(200).json({ message: "Estado atualizado com sucesso" });
  } catch (err) {
    console.error("Erro ao atualizar estado:", err);
    return res.status(500).json({ message: "Erro ao atualizar estado" });
  }
}
