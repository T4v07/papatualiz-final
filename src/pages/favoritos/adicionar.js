import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, produtoId } = req.body;
  if (!email || !produtoId) return res.status(400).json({ error: "Dados incompletos" });

  try {
    const [users] = await pool.query("SELECT ID_utilizador FROM Utilizador WHERE Email = ?", [email]);
    const user = users[0];
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    const [favoritos] = await pool.query(
      "SELECT * FROM Favorito WHERE ID_utilizador = ? AND ID_produto = ?",
      [user.ID_utilizador, produtoId]
    );

    if (favoritos.length > 0) {
      await pool.query("DELETE FROM Favorito WHERE ID_utilizador = ? AND ID_produto = ?", [user.ID_utilizador, produtoId]);
      return res.status(200).json({ removido: true });
    } else {
      await pool.query("INSERT INTO Favorito (ID_utilizador, ID_produto) VALUES (?, ?)", [user.ID_utilizador, produtoId]);
      return res.status(200).json({ adicionado: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
}
