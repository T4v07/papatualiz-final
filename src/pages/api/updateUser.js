import { pool } from "../../utils/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido." });
  }

  const { id, nome, username, email, telefone, dataNascimento, senhaAtual, novaSenha } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID do usuário é obrigatório." });
  }

  try {
    const [users] = await pool.query("SELECT * FROM Utilizador WHERE ID_utilizador = ?", [id]);

    if (users.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    let hashedNovaSenha = null;

    if (novaSenha) {
      const senhaCorreta = await bcrypt.compare(senhaAtual, users[0].Password);
      if (!senhaCorreta) {
        return res.status(400).json({ message: "Senha atual incorreta." });
      }
      hashedNovaSenha = await bcrypt.hash(novaSenha, 10);
    }

    const query = `
      UPDATE Utilizador 
      SET Nome = ?, Username = ?, Email = ?, Telefone = ?, DataNascimento = ?
      ${novaSenha ? ", Password = ?" : ""}
      WHERE ID_utilizador = ?
    `;

    const params = novaSenha
      ? [nome, username, email, telefone, dataNascimento || null, hashedNovaSenha, id]
      : [nome, username, email, telefone, dataNascimento || null, id];

    await pool.query(query, params);

    return res.status(200).json({ message: "Dados atualizados com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return res.status(500).json({ message: "Erro ao atualizar usuário." });
  }
}
