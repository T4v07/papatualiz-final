import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "PUT") return res.status(405).json({ message: "Método não permitido" });

  const { id, arquivar } = req.body;
  if (!id || typeof arquivar !== "boolean") return res.status(400).json({ message: "Dados inválidos" });

  try {
    await pool.query("UPDATE Encomenda SET Arquivado = ? WHERE ID_encomenda = ?", [arquivar ? 1 : 0, id]);
    return res.status(200).json({ message: "Status de arquivado atualizado" });
  } catch (err) {
    console.error("Erro ao atualizar arquivado:", err);
    return res.status(500).json({ message: "Erro ao atualizar arquivado" });
  }
}
