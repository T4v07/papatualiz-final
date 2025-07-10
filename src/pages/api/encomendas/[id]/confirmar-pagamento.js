import { pool } from "@/utils/db";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "POST") {
    return res.status(405).json({ mensagem: "Método não permitido" });
  }

  if (!id) {
    return res.status(400).json({ mensagem: "ID da encomenda é obrigatório" });
  }

  try {
    // Atualizar estado da encomenda
    const [result] = await pool.execute(
      `UPDATE Encomenda SET Estado = ? WHERE ID_compra = ?`,
      ["Pago", id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Encomenda não encontrada" });
    }

    // Buscar dados da encomenda
    const [encomendas] = await pool.execute(
      `SELECT * FROM Encomenda WHERE ID_compra = ?`,
      [id]
    );
    const encomenda = encomendas[0];

    // Buscar os produtos comprados
    const [produtos] = await pool.execute(
      `SELECT p.Nome_Produtos AS Nome, cp.Quantidade, cp.Preco_unitario
       FROM Compra_Produto cp
       JOIN Produtos p ON p.ID_produto = cp.ID_produto
       WHERE cp.ID_compra = ?`,
      [id]
    );

    // Montar mensagem de produtos
    const listaProdutos = produtos
      .map(
        (prod) =>
          `- ${prod.Nome} (x${prod.Quantidade}): €${Number(prod.Preco_unitario).toFixed(2)}`
      )
      .join("\n");

    const mensagem = `
Olá ${encomenda.nome} ${encomenda.apelido},

A sua encomenda foi confirmada com sucesso!

🛒 Produtos:
${listaProdutos}

📦 Subtotal: €${Number(encomenda.Subtotal).toFixed(2)}
🚚 Taxa de entrega: €${Number(encomenda.Frete).toFixed(2)}
💰 Total pago: €${Number(encomenda.Total_Valor).toFixed(2)}

📬 Entrega para:
${encomenda.Endereco_entrega}

Obrigado por comprar na SportSet!

— Equipa SportSet
    `;

    // Enviar email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: encomenda.email,
      subject: "Confirmação de Encomenda - SportSet",
      text: mensagem,
    });

    res.status(200).json({ mensagem: "Pagamento confirmado e email enviado com sucesso!" });
  } catch (error) {
    console.error("Erro ao confirmar pagamento:", error);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
}
