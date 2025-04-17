import { pool } from "@/utils/db";

export default async function handler(req, res) {
  const { email } = req.query;

  if (!email) return res.status(400).json({ message: "Email é obrigatório" });

  try {
    const [userResult] = await pool.query(`SELECT ID_utilizador FROM Utilizador WHERE Email = ?`, [email]);
    const user = userResult[0];
    if (!user) return res.status(404).json([]);

    const [compras] = await pool.query(`SELECT * FROM Compra WHERE ID_utilizador = ? ORDER BY Data_compra DESC`, [user.ID_utilizador]);
    res.status(200).json(compras);
  } catch (err) {
    console.error("Erro ao buscar compras:", err);
    res.status(500).json({ message: "Erro interno" });
  }
}
