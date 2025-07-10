// /pages/api/encomendas/listar-por-id.js
import { pool } from "@/utils/db";

export default async function handler(req, res) {
  const { usuario_id } = req.query;

  if (!usuario_id) {
    return res.status(400).json({ message: "ID do utilizador é obrigatório" });
  }

  try {
    const [encomendas] = await pool.query(
      `SELECT 
        ID_encomenda,
        Estado,
        Codigo_rastreio,
        Data_criacao
      FROM Encomenda
      WHERE usuario_id = ?
      ORDER BY Data_criacao DESC`,
      [usuario_id]
    );

    res.status(200).json(encomendas);
  } catch (error) {
    console.error("Erro ao listar encomendas:", error);
    res.status(500).json({ message: "Erro interno" });
  }
}
