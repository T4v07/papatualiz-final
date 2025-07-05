// pages/api/recuperar.js
import nodemailer from "nodemailer";
import { pool } from "../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "O e-mail é obrigatório." });
  }

  try {
    // 1. Verifica se o e-mail existe
    const [rows] = await pool.query("SELECT * FROM Utilizador WHERE Email = ?", [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "E-mail não encontrado." });
    }

    // 2. Gerar código de recuperação
    const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Atualizar o código na base de dados
    await pool.query("UPDATE Utilizador SET Codigo_Recuperacao = ? WHERE Email = ?", [
      recoveryCode,
      email,
    ]);

    // 4. Enviar o e-mail
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
      subject: "Código de Recuperação - SportSet",
      html: `
        <h2>Recuperação de Senha</h2>
        <p>O seu código de recuperação é: <strong>${recoveryCode}</strong></p>
        <p>Utilize este código para redefinir a sua senha.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Código de recuperação enviado com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar código:", error);
    res.status(500).json({ message: "Erro ao enviar código de recuperação." });
  }
}
