import { pool } from "@/utils/db";

export default async function handler(req, res) {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email obrigatório" });

  try {
    const [users] = await pool.query("SELECT ID_utilizador FROM Utilizador WHERE Email = ?", [email]);
    const user = users[0];
    if (!user) return res.status(404).json([]);

    const [favoritos] = await pool.query(
      `SELECT P.* FROM Favorito F
       JOIN Produtos P ON F.ID_produto = P.ID_produto
       WHERE F.ID_utilizador = ?`,
      [user.ID_utilizador]
    );

    res.status(200).json(favoritos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
}
