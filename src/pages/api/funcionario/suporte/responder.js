import { pool } from "@/utils/db";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { ID_suporte, resposta, nome, email, assunto } = req.body;

  if (!ID_suporte || !resposta || !email || !nome || !assunto) {
    return res.status(400).json({ message: "Dados incompletos" });
  }

  try {
    await pool.execute(
      `UPDATE Suporte SET Resposta = ?, Estado = 'respondido' WHERE ID_suporte = ?`,
      [resposta, ID_suporte]
    );

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: `"SportsET Suporte" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: `Resposta ao seu pedido de suporte: ${assunto}`,
      html: `
        <p>Olá ${nome},</p>
        <p>Respondemos ao seu pedido com o assunto: <strong>${assunto}</strong></p>
        <p><strong>Resposta:</strong></p>
        <blockquote>${resposta}</blockquote>
        <p>Se precisares de mais ajuda, estamos por aqui.</p>
        <br/>
        <p>Atenciosamente,<br/>Equipa SportsET</p>
      `,
    });

    return res.status(200).json({ message: "Resposta enviada com sucesso" });
  } catch (err) {
    console.error("Erro ao responder suporte:", err);
    return res.status(500).json({ message: "Erro ao responder suporte" });
  }
}
