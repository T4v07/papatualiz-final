import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido." });
  }

  const { email, username } = req.body;

  try {
    const [[emailCheck]] = await pool.query(
      "SELECT COUNT(*) AS total FROM Utilizador WHERE Email = ?",
      [email]
    );

    const [[usernameCheck]] = await pool.query(
      "SELECT COUNT(*) AS total FROM Utilizador WHERE Username = ?",
      [username]
    );

    res.status(200).json({
      emailExiste: emailCheck.total > 0,
      usernameExiste: usernameCheck.total > 0,
    });
  } catch (err) {
    console.error("Erro ao verificar utilizador:", err);
    res.status(500).json({ message: "Erro ao verificar utilizador." });
  }
}
