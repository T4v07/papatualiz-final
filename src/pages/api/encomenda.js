import { pool } from "@/utils/db";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Método não permitido" });

  const { endereco_entrega, notas, rua, numero, codigoPostal, cidade, pais } = req.body;

  try {
    const [ultimaCompra] = await pool.query(
      `SELECT * FROM Compra ORDER BY ID_compra DESC LIMIT 1`
    );
    const compra = ultimaCompra[0];
    if (!compra) return res.status(400).json({ message: "Compra não encontrada" });

    const [encomendaRows] = await pool.query(
      `SELECT * FROM Encomenda WHERE ID_compra = ?`,
      [compra.ID_compra]
    );
    const encomenda = encomendaRows[0];
    if (!encomenda) return res.status(400).json({ message: "Encomenda não encontrada" });

    const [utilizadores] = await pool.query(
      `SELECT Nome, Email FROM Utilizador WHERE ID_utilizador = ?`,
      [compra.ID_utilizador]
    );
    const cliente = utilizadores[0];

    const [produtos] = await pool.query(`
      SELECT Produtos.Nome_Produtos AS Nome, CP.Quantidade, CP.Preco_unitario AS Preco
      FROM Compra_Produto CP
      JOIN Produtos ON CP.ID_produto = Produtos.ID_produto
      WHERE CP.ID_compra = ?
    `, [compra.ID_compra]);

    // Atualiza os campos separados na tabela Encomenda
    await pool.query(
      `UPDATE Encomenda SET Endereco_entrega = ?, Notas = ?, Rua = ?, Numero = ?, Codigo_postal = ?, Cidade = ?, Pais = ?
       WHERE ID_compra = ?`,
      [endereco_entrega, notas, rua, numero, codigoPostal, cidade, pais, compra.ID_compra]
    );

    const listaProdutos = produtos.map(
      (p) => `• ${p.Nome} (x${p.Quantidade}) - ${parseFloat(p.Preco).toFixed(2)}€`
    ).join("\n");

    const total = produtos.reduce(
      (acc, p) => acc + parseFloat(p.Preco) * p.Quantidade,
      0
    );

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      secure: false,
      tls: { rejectUnauthorized: false }
    });

    const mailOptions = {
      from: `"SPORTS ET" <${process.env.EMAIL_FROM}>`,
      to: cliente.Email,
      subject: "📦 Encomenda Recebida com Sucesso",
      text: `
Olá ${cliente.Nome}!

A tua encomenda foi recebida com sucesso.

📍 Endereço de entrega:
${endereco_entrega}

🛒 Produtos:
${listaProdutos}

💰 Total: ${total.toFixed(2)}€

🔁 Código de rastreio: ${encomenda.Codigo_rastreio}

Obrigado por comprar conosco!
- Equipa Sports ET
      `
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Encomenda registrada com sucesso" });

  } catch (err) {
    console.error("Erro ao salvar encomenda:", err);
    return res.status(500).json({ message: "Erro interno" });
  }
}
