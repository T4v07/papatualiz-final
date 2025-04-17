import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const [result] = await pool.query(`
        SELECT * FROM Suporte
        ORDER BY Data_envio DESC
      `);
      return res.status(200).json(result);
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
      return res.status(500).json({ message: "Erro ao buscar pedidos" });
    }
  }

  return res.status(405).json({ message: "Método não permitido" });
}
