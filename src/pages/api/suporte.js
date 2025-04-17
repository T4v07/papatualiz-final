import nodemailer from "nodemailer";
import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  try {
    const { ID_utilizador, Assunto, Mensagem, Nome, Email } = req.body;

    if (!ID_utilizador || !Assunto || !Mensagem || !Nome || !Email) {
      return res.status(400).json({ message: "Campos obrigatórios em falta" });
    }

    // Data ajustada para Portugal (UTC+1 — muda para 0 se estiver em UTC)
    const agora = new Date();
    const horaPortugal = new Date(agora.getTime() + 1 * 60 * 60 * 1000);
    const dataFormatada = horaPortugal.toISOString().slice(0, 19).replace("T", " ");

    // Inserir na base de dados com hora ajustada
    await pool.execute(
      `INSERT INTO Suporte (ID_utilizador, Assunto, Mensagem, Estado, Data_envio, Nome, Email)
       VALUES (?, ?, ?, 'pendente', ?, ?, ?)`,
      [ID_utilizador, Assunto, Mensagem, dataFormatada, Nome, Email]
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
      to: Email,
      subject: "Pedido de Suporte Recebido",
      html: `
        <p>Olá ${Nome},</p>
        <p>Recebemos o seu pedido de suporte com o assunto:</p>
        <blockquote><strong>${Assunto}</strong></blockquote>
        <p>Mensagem:</p>
        <p>${Mensagem}</p>
        <p>Entraremos em contacto em breve.</p>
        <br/>
        <p>Atenciosamente,<br/>Equipa SportsET</p>
      `,
    });

    return res.status(200).json({ message: "Pedido de suporte enviado com sucesso" });
  } catch (error) {
    console.error("Erro no suporte:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}
