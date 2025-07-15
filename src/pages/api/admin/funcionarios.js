import bcrypt from "bcryptjs";
import { pool } from "@/utils/db";
import { DateTime } from "luxon";

// Agora grava direto no fuso de Lisboa, sem +1 hora manual
function getDataHoraLisboa() {
  return DateTime.now().setZone("Europe/Lisbon").toFormat("yyyy-MM-dd HH:mm:ss");
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const [rows] = await pool.query(`
        SELECT ID_utilizador, Nome, Username, Email, Telefone, Ativo
        FROM Utilizador
        WHERE Tipo_de_Conta = 'funcionario'
      `);
      return res.status(200).json(rows);
    } catch (err) {
      console.error("Erro ao buscar funcionários:", err);
      return res.status(500).json({ message: "Erro no servidor." });
    }
  }

  if (req.method === "POST") {
    const { nome, username, email, telefone, password, autorNome } = req.body;
    if (!nome || !username || !email || !password) {
      return res.status(400).json({ message: "Campos obrigatórios não preenchidos." });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      await pool.query(
        `INSERT INTO Utilizador 
         (Nome, Username, Email, Telefone, Password, Tipo_de_Conta, Ativo)
         VALUES (?, ?, ?, ?, ?, 'funcionario', 0)`,
        [nome, username, email, telefone, hashedPassword]
      );

      const [[novo]] = await pool.query("SELECT * FROM Utilizador WHERE Email = ?", [email]);

      await pool.query(
        `INSERT INTO FuncionarioLogs 
         (ID_funcionario, Nome_funcionario, Acao, Autor_nome, DataHora)
         VALUES (?, ?, ?, ?, ?)`,
        [novo.ID_utilizador, nome, "criado", autorNome || "sistema", getDataHoraLisboa()]
      );

      return res.status(201).json(novo);
    } catch (err) {
      console.error("Erro ao criar funcionário:", err);
      return res.status(500).json({ message: "Erro ao criar funcionário" });
    }
  }

  if (req.method === "PUT") {
    const { id, campo, valor, autorNome } = req.body;
    const camposPermitidos = ["Nome", "Telefone", "Ativo"];
    if (!id || !camposPermitidos.includes(campo)) {
      return res.status(400).json({ message: "Requisição inválida." });
    }

    try {
      const [[antes]] = await pool.query(
        `SELECT ${campo}, Nome FROM Utilizador WHERE ID_utilizador = ?`,
        [id]
      );

      await pool.query(
        `UPDATE Utilizador SET ${campo} = ? WHERE ID_utilizador = ?`,
        [valor, id]
      );

      await pool.query(
        `INSERT INTO FuncionarioLogs 
         (ID_funcionario, Nome_funcionario, Acao, Campo_alterado, Valor_antigo, Valor_novo, Autor_nome, DataHora)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          antes.Nome,
          "atualizado",
          campo,
          String(antes[campo]),
          String(valor),
          autorNome || "sistema",
          getDataHoraLisboa(),
        ]
      );

      return res.status(200).json({ message: "Atualizado com sucesso." });
    } catch (err) {
      console.error("Erro ao atualizar funcionário:", err);
      return res.status(500).json({ message: "Erro ao atualizar." });
    }
  }

  if (req.method === "DELETE") {
    const { id, autorNome } = req.body;
    if (!id) return res.status(400).json({ message: "ID não fornecido." });

    try {
      const [[func]] = await pool.query(
        `SELECT Nome FROM Utilizador WHERE ID_utilizador = ?`,
        [id]
      );

      await pool.query(`DELETE FROM Utilizador WHERE ID_utilizador = ?`, [id]);

      await pool.query(
        `INSERT INTO FuncionarioLogs 
         (ID_funcionario, Nome_funcionario, Acao, Autor_nome, DataHora)
         VALUES (?, ?, ?, ?, ?)`,
        [
          id,
          func?.Nome || "Desconhecido",
          "excluído",
          autorNome || "sistema",
          getDataHoraLisboa(),
        ]
      );

      return res.status(200).json({ message: "Funcionário excluído com sucesso." });
    } catch (err) {
      console.error("Erro ao excluir funcionário:", err);
      return res.status(500).json({ message: "Erro ao excluir." });
    }
  }

  res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
  return res.status(405).end(`Método ${req.method} não permitido`);
}
