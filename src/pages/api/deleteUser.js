import { pool } from "../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Método não permitido." });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID do usuário é obrigatório." });
  }

  try {
    // Verifica se o usuário existe
    const [user] = await pool.query("SELECT * FROM Utilizador WHERE ID_utilizador = ?", [id]);

    if (user.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Deleta o usuário
    await pool.query("DELETE FROM Utilizador WHERE ID_utilizador = ?", [id]);

    return res.status(200).json({ message: "Usuário deletado com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    return res.status(500).json({ message: "Erro ao deletar usuário." });
  }
}
