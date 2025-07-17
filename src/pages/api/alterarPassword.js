import { pool } from "@/utils/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido." });
  }

  const { id, senhaAtual, novaSenha } = req.body;

  if (!id || !senhaAtual || !novaSenha) {
    return res.status(400).json({ message: "Dados obrigatórios em falta." });
  }

  try {
    const [resultado] = await pool.query(
      "SELECT Password FROM Utilizador WHERE ID_utilizador = ?",
      [id]
    );

    if (resultado.length === 0) {
      return res.status(404).json({ message: "Utilizador não encontrado." });
    }

    const senhaGuardada = resultado[0].Password;
    const senhaCorreta = await bcrypt.compare(senhaAtual, senhaGuardada);

    if (!senhaCorreta) {
      return res.status(401).json({ message: "Palavra-passe atual incorreta." });
    }

    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

    await pool.query(
      "UPDATE Utilizador SET Password = ? WHERE ID_utilizador = ?",
      [novaSenhaHash, id]
    );

    return res.status(200).json({ message: "Palavra-passe alterada com sucesso!" });
  } catch (error) {
    console.error("Erro ao alterar a palavra-passe:", error);
    return res.status(500).json({ message: "Erro ao alterar a palavra-passe." });
  }
}
