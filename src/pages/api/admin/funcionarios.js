import bcrypt from "bcryptjs";
import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const [rows] = await pool.query(`
      SELECT ID_utilizador, Nome, Username, Email, Telefone, Ativo
      FROM Utilizador
      WHERE Tipo_de_Conta = 'funcionario'
    `);
    return res.status(200).json(rows);
  }

  if (req.method === "POST") {
    const { nome, username, email, telefone, password } = req.body;
    if (!nome || !username || !email || !password) {
      return res.status(400).json({ message: "Campos obrigatórios não preenchidos." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      await pool.query(
        `INSERT INTO Utilizador 
         (Nome, Username, Email, Telefone, Password, Tipo_de_Conta, Ativo)
         VALUES (?, ?, ?, ?, ?, 'funcionario', 0)`,
        [nome, username, email, telefone, hashedPassword]
      );

      const [novo] = await pool.query("SELECT * FROM Utilizador WHERE Email = ?", [email]);
      return res.status(201).json(novo[0]);
    } catch (err) {
      console.error("Erro ao criar funcionário:", err);
      return res.status(500).json({ message: "Erro ao criar funcionário" });
    }
  }

  res.status(405).end();
}
