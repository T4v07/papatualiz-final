import { pool } from "../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido." });
  }

  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email é obrigatório." });
  }

  try {
    const [users] = await pool.query(
      "SELECT ID_utilizador, Nome, Username, Email, Telefone, Endereco, DataNascimento FROM Utilizador WHERE Email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    return res.status(200).json(users[0]);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return res.status(500).json({ message: "Erro ao buscar usuário." });
  }
}
