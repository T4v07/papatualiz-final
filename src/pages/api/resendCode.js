// pages/api/resendCode.js
import nodemailer from "nodemailer";
import { pool } from "../../utils/db"; // Caminho ajustado

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "E-mail é obrigatório!" });
  }

  try {
    // Verifica se o usuário existe e não está verificado ainda
    const [user] = await pool.query(
      "SELECT * FROM Utilizador WHERE Email = ? AND Verificado = 0",
      [email]
    );

    if (user.length === 0) {
      return res.status(400).json({ message: "E-mail não encontrado ou já verificado!" });
    }

    // Gera um novo código de verificação
    const newVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Atualiza o código de verificação no banco de dados
    await pool.query(
      "UPDATE Utilizador SET Codigo_Verificacao = ? WHERE Email = ?",
      [newVerificationCode, email]
    );

    // Configuração do envio de e-mail via SMTP (Gmail)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      secure: false,
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Novo Código de Verificação - SportSet",
      html: `
        <h2>Olá!</h2>
        <p>Seu novo código de verificação é: <strong>${newVerificationCode}</strong></p>
        <p>Use este novo código para concluir seu registro.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Novo código enviado!" });
  } catch (error) {
    console.error("Erro ao reenviar código:", error);
    res.status(500).json({ message: "Erro ao reenviar código." });
  }
}
