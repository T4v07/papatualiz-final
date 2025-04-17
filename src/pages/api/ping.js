import { pool } from "@/utils/db";

export default async function handler(req, res) {
  try {
    const [result] = await pool.query("SELECT 1 + 1 AS resultado");
    res.status(200).json({ success: true, result });
  } catch (err) {
    console.error("Erro ao conectar ao MySQL:", err);
    res.status(500).json({ success: false });
  }
}
