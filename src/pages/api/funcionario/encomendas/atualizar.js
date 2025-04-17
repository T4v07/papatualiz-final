import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { idEncomenda, novoEstado } = req.body;

  if (!idEncomenda || !novoEstado) {
    return res.status(400).json({ message: "Dados incompletos" });
  }

  try {
    await pool.query(
      "UPDATE Encomenda SET Estado = ? WHERE ID_encomenda = ?",
      [novoEstado, idEncomenda]
    );
    res.status(200).json({ message: "Estado atualizado com sucesso" });
  } catch (err) {
    console.error("Erro ao atualizar encomenda:", err);
    res.status(500).json({ message: "Erro no servidor" });
  }
}
