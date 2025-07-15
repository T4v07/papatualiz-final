// /pages/api/resendCode.js
import nodemailer from "nodemailer";
import { pool } from "@/utils/db"; // Caminho ajustado

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Método não permitido" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "E-mail é obrigatório!" });
  }

  try {
    // Verifica se o utilizador existe e ainda não está verificado
    const [user] = await pool.query(
      "SELECT * FROM Utilizador WHERE Email = ? AND Verificado = 0",
      [email]
    );

    if (user.length === 0) {
      return res.status(404).json({ success: false, message: "E-mail não encontrado ou já verificado." });
    }

    // Gera novo código de verificação
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Atualiza o código na base de dados
    await pool.query(
      "UPDATE Utilizador SET Codigo_Verificacao = ? WHERE Email = ?",
      [newCode, email]
    );

    // Envia o email com o novo código
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      secure: false,
      tls: { rejectUnauthorized: false },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Novo Código de Verificação - SportSet",
      html: `
        <h2>Olá!</h2>
        <p>O teu novo código de verificação é:</p>
        <h3 style="font-size: 22px; color: #333;">${newCode}</h3>
        <p>Utiliza-o para concluir o teu registo no SportSet.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: "✅ Novo código enviado com sucesso!" });
  } catch (error) {
    console.error("Erro ao reenviar código:", error);
    return res.status(500).json({ success: false, message: "Erro ao reenviar código." });
  }
}
