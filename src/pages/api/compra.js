import { pool } from "@/utils/db";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Método não permitido" });

  const { id_utilizador, userNome, userEmail } = req.body;

  try {
    const [carrinho] = await pool.query(
      `SELECT c.ID_produto, c.Quantidade, p.Nome_Produtos, p.Preco 
       FROM Carrinho c
       JOIN Produtos p ON c.ID_produto = p.ID_produto
       WHERE c.ID_utilizador = ?`,
      [id_utilizador]
    );

    if (carrinho.length === 0) {
      return res.status(400).json({ message: "Carrinho vazio" });
    }

    const token = uuidv4();
    const agora = new Date();
    const total = carrinho.reduce((acc, item) => acc + item.Quantidade * parseFloat(item.Preco), 0);

    const dados = JSON.stringify({
      carrinho,
      total,
      userNome,
      userEmail
    });

    await pool.query(
      `INSERT INTO Compra_Pendente (ID_token, ID_utilizador, Dados, Criado_em)
       VALUES (?, ?, ?, ?)`,
      [token, id_utilizador, dados, agora]
    );

    const confirmLink = `http://localhost:3000/confirmar-compra?token=${token}`;

    const html = `
      <h2>Olá ${userNome},</h2>
      <p>Recebemos seu pedido! Para confirmar a compra, clique no botão abaixo:</p>
      <a href="${confirmLink}" style="display:inline-block;padding:12px 20px;background-color:#004aad;color:white;text-decoration:none;border-radius:6px;font-weight:bold;">
        Confirmar Compra
      </a>
      <p style="margin-top:20px;">Este link é válido por 5 minutos.</p>
    `;

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

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: userEmail,
      subject: "Confirmação da Compra - SportsET",
      html,
    });

    return res.status(200).json({ message: "E-mail enviado com sucesso. Verifique sua caixa de entrada!" });

  } catch (err) {
    console.error("Erro ao iniciar compra:", err);
    return res.status(500).json({ message: "Erro ao iniciar compra" });
  }
}
