// /pages/api/encomendas/listar.js
import { pool } from "@/utils/db";

export default async function handler(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT e.*, u.Nome AS Nome_Cliente
      FROM Encomenda e
      JOIN Compra c ON e.ID_compra = c.ID_compra
      JOIN Utilizador u ON c.ID_utilizador = u.ID_utilizador
      ORDER BY e.ID_encomenda DESC
    `);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Erro ao listar encomendas:", err);
    res.status(500).json({ message: "Erro interno" });
  }
}
