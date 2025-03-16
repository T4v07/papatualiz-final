// pages/api/register.js
import bcrypt from "bcryptjs";
import { pool } from "../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido." });
  }

  const { username, password, nome, email, telefone } = req.body;

  try {
    // Verifica se já existe um usuário com esse email ou username
    const [existingUsers] = await pool.query(
      "SELECT * FROM Utilizador WHERE Email = ? OR Username = ?",
      [email, username]
    );

    if (existingUsers.length > 0) {
      return res
        .status(400)
        .json({ message: "Email ou Username já cadastrado!" });
    }

    // Gera um código de verificação (se você precisar disso)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Hasheia a senha para armazenamento seguro
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insere o novo usuário com a senha hasheada
    await pool.query(
      `INSERT INTO Utilizador (Username, Password, Nome, Email, Telefone, Codigo_Verificacao, Verificado)
       VALUES (?, ?, ?, ?, ?, ?, 0)`,
      [username, hashedPassword, nome, email, telefone, verificationCode]
    );

    return res.status(200).json({
      message: "Usuário registrado com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return res.status(500).json({ message: "Erro ao registrar usuário." });
  }
}
