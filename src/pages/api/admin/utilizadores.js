import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const [rows] = await pool.query(`
        SELECT ID_utilizador, Nome, Username, Email, Telefone, Tipo_de_Conta, ativo
        FROM Utilizador
      `);
      res.status(200).json(rows);
    } catch (err) {
      console.error("Erro ao buscar utilizadores:", err);
      res.status(500).json({ message: "Erro no servidor." });
    }
  }

  if (req.method === "PUT") {
    const { id, campo, valor } = req.body;
    if (!id || !campo || typeof valor === "undefined") {
      return res.status(400).json({ message: "Dados incompletos." });
    }

    try {
      await pool.execute(
        `UPDATE Utilizador SET ${campo} = ? WHERE ID_utilizador = ?`,
        [valor, id]
      );
      return res.status(200).json({ message: "Atualizado com sucesso!" });
    } catch (err) {
      console.error("Erro ao atualizar:", err);
      return res.status(500).json({ message: "Erro ao atualizar." });
    }
  }

  res.setHeader("Allow", ["GET", "PUT"]);
  res.status(405).end(`Método ${req.method} não permitido`);
}
