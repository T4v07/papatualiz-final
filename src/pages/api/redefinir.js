// /pages/api/redefinir.js
import { hash } from "bcryptjs";
import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { codigo, novaPassword } = req.body;

  if (!codigo || !novaPassword) {
    return res.status(400).json({ message: "Campos obrigatórios em falta." });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM Utilizador WHERE Codigo_Recuperacao = ?",
      [codigo]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Código inválido ou expirado." });
    }

    const utilizador = rows[0];
    const hashedPassword = await hash(novaPassword, 10);

    await pool.query(
      "UPDATE Utilizador SET Password = ?, Codigo_Recuperacao = NULL WHERE ID_utilizador = ?",
      [hashedPassword, utilizador.ID_utilizador]
    );

    return res.status(200).json({ message: "Senha atualizada com sucesso!" });
  } catch (erro) {
    console.error("Erro ao redefinir senha:", erro);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
}
