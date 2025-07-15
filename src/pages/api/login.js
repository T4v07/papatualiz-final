import bcrypt from "bcryptjs";
import { pool } from "../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido." });
  }

  const { username, password } = req.body;

  try {
    // Consulta pelo username ou email
    const [rows] = await pool.query(
      "SELECT * FROM Utilizador WHERE Username = ? OR Email = ?",
      [username, username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Utilizador não encontrado!" });
    }

    const user = rows[0];

    // Verifica se a conta está ativa
    if (user.Ativo === 0) {
  return res.status(403).json({ 
    message: "Sua conta foi desativada. Para mais informações, por favor envie um email para suportepapsportset@gmail.com." 
  });
}


    // Verifica a senha
    const isMatch = await bcrypt.compare(password, user.Password);

    if (!isMatch) {
      return res.status(401).json({ message: "Senha incorreta!" });
    }

    // Login bem-sucedido
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
