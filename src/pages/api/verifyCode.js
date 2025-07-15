// /pages/api/verifyCode.js
import { pool } from "@/utils/db"; // Usa o teu caminho correto aqui

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Método não permitido" });
  }

  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ success: false, message: "E-mail e código são obrigatórios!" });
  }

  try {
    console.log(`🔍 Verificando código para: ${email}`);

    // Verifica se existe um utilizador com o código correto e ainda não verificado
    const [rows] = await pool.query(
      `SELECT ID_utilizador FROM Utilizador WHERE Email = ? AND Codigo_Verificacao = ? AND Verificado = 0`,
      [email, code]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "❌ Código inválido ou já foi verificado." });
    }

    // Marca como verificado e apaga o código
    await pool.query(
      `UPDATE Utilizador SET Verificado = 1, Codigo_Verificacao = NULL WHERE Email = ?`,
      [email]
    );

    return res.status(200).json({ success: true, message: "✅ Conta verificada com sucesso!" });
  } catch (error) {
    console.error("Erro ao verificar código:", error);
    return res.status(500).json({ success: false, message: "Erro interno ao verificar código." });
  }
}
