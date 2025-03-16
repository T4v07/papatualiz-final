// pages/api/login.js
import bcrypt from "bcryptjs";
import { pool } from "../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido." });
  }

  const { username, password } = req.body;

  try {
    // Procura pelo usuário com o username fornecido
    const [rows] = await pool.query(
      "SELECT * FROM Utilizador WHERE Username = ?",
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Usuário não encontrado!" });
    }

    const user = rows[0];

    // Compara a senha digitada com a senha hasheada do banco
    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ message: "Senha incorreta!" });
    }

    // Se quiser gerar um token JWT, você pode fazer aqui.
    // Exemplo simples sem token:
    return res.status(200).json({
      message: "Login bem-sucedido!",
      user: {
        username: user.Username,
        email: user.Email,
        nome: user.Nome,
      },
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return res.status(500).json({ message: "Erro ao fazer login." });
  }
}
