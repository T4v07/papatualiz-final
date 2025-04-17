// /api/encomendas-do-utilizador.js
import { pool } from "@/utils/db";


export default async function handler(req, res) {
  const { email } = req.query;

  if (!email) return res.status(400).json({ message: "Email é obrigatório" });

  try {
    const [userResult] = await pool.query(`SELECT ID_utilizador FROM Utilizador WHERE Email = ?`, [email]);
    const user = userResult[0];
    if (!user) return res.status(404).json([]);

    const [encomendas] = await pool.query(`
      SELECT E.* FROM Encomenda E
      JOIN Compra C ON E.ID_compra = C.ID_compra
      WHERE C.ID_utilizador = ?
      ORDER BY E.Data_criacao DESC
    `, [user.ID_utilizador]);

    res.status(200).json(encomendas);
  } catch (err) {
    console.error("Erro ao buscar encomendas:", err);
    res.status(500).json({ message: "Erro interno" });
  }
}
