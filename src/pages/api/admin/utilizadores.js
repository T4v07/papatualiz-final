// /api/admin/utilizadores.js
import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const [rows] = await pool.query(`
        SELECT ID_utilizador, Nome, Username, Email, Telefone, Tipo_de_Conta, ativo
        FROM Utilizador
      `);
      return res.status(200).json(rows);
    } catch (err) {
      console.error("Erro ao buscar utilizadores:", err);
      return res.status(500).json({ message: "Erro no servidor." });
    }
  }

  if (req.method === "PUT") {
    try {
      const { id, campo, valor, autorNome } = req.body;

      if (!id || !campo || typeof valor === "undefined") {
        return res.status(400).json({ message: "Dados incompletos." });
      }

      const camposPermitidos = ["ativo", "Tipo_de_Conta"];
      if (!camposPermitidos.includes(campo)) {
        return res.status(400).json({ message: "Campo inválido para atualização." });
      }

      if (campo === "ativo" && valor !== 0 && valor !== 1) {
        return res.status(400).json({ message: "Valor inválido para 'ativo'." });
      }

      if (campo === "Tipo_de_Conta") {
        const tiposValidos = ["cliente", "funcionario", "admin"];
        if (!tiposValidos.includes(valor)) {
          return res.status(400).json({ message: "Valor inválido para 'Tipo_de_Conta'." });
        }
      }

      const [[antes]] = await pool.query(
        `SELECT Nome, ${campo}, Tipo_de_Conta FROM Utilizador WHERE ID_utilizador = ?`,
        [id]
      );

      if (!antes) {
        return res.status(404).json({ message: "Utilizador não encontrado." });
      }

      await pool.query(
        `UPDATE Utilizador SET ${campo} = ? WHERE ID_utilizador = ?`,
        [valor, id]
      );

      if (antes.Tipo_de_Conta === "funcionario") {
        await pool.query(
          `INSERT INTO FuncionarioLogs 
           (ID_funcionario, Nome_funcionario, Acao, Campo_alterado, Valor_antigo, Valor_novo, Autor_nome)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            antes.Nome,
            "atualizado",
            campo === "ativo" ? "Ativo" : "Tipo_de_Conta",
            String(antes[campo]),
            String(valor),
            autorNome && autorNome.trim() !== "" ? autorNome.trim() : "Administrador",
          ]
        );
      }

      return res.status(200).json({ message: "Atualizado com sucesso!" });
    } catch (err) {
      console.error("Erro ao atualizar utilizador:", err);
      return res.status(500).json({ message: "Erro ao atualizar utilizador." });
    }
  }

  res.setHeader("Allow", ["GET", "PUT"]);
  return res.status(405).end(`Método ${req.method} não permitido`);
}
