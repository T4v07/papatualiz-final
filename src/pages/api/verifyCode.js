// pages/api/verifyCode.js
import { pool } from "../../utils/db"; // Caminho ajustado

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: "E-mail e código são obrigatórios!" });
  }

  try {
    console.log(`Verificando código para: ${email}`);

    // Verifica se o email e o código correspondem e se o usuário não foi verificado
    const [rows] = await pool.query(
      "SELECT * FROM Utilizador WHERE Email = ? AND Codigo_Verificacao = ? AND Verificado = 0",
      [email, code]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Código inválido ou expirado!" });
    }

    // Atualiza o usuário para "verificado" e remove o código
    await pool.query(
      "UPDATE Utilizador SET Verificado = 1, Codigo_Verificacao = NULL WHERE Email = ?",
      [email]
    );

    res.status(200).json({ message: "Conta verificada com sucesso!" });
  } catch (error) {
    console.error("Erro ao verificar código:", error);
    res.status(500).json({ message: "Erro ao verificar código. Tente novamente." });
  }
}
