import bcrypt from "bcryptjs";
import { pool } from "../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido." });
  }

  const { username, password } = req.body;

  try {
    // Verifica se é um email (tem "@"), se não, assume como username
    const [rows] = await pool.query(
      "SELECT * FROM Utilizador WHERE Username = ? OR Email = ?",
      [username, username] // usa o mesmo valor para ambas colunas
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Utilizador não encontrado!" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.Password);

    if (!isMatch) {
      return res.status(401).json({ message: "Senha incorreta!" });
    }

    return res.status(200).json({
      message: "Login bem-sucedido!",
      user: {
        ID_utilizador: user.ID_utilizador,
        Username: user.Username,
        Email: user.Email,
        Nome: user.Nome,
        Tipo_de_Conta: user.Tipo_de_Conta,
      },
    });

  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return res.status(500).json({ message: "Erro interno ao fazer login." });
  }
}
