import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido." });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ message: "ID do funcionário não fornecido." });
  }

  try {
    const [logs] = await pool.query(
      `SELECT ID_log, Acao, Campo_alterado, Valor_antigo, Valor_novo, DataHora, Autor_nome
       FROM FuncionarioLogs
       WHERE ID_funcionario = ?
       ORDER BY DataHora DESC`,
      [id]
    );

    return res.status(200).json(logs);
  } catch (err) {
    console.error("Erro ao buscar histórico do funcionário:", err);
    return res.status(500).json({ message: "Erro ao buscar histórico." });
  }
}
