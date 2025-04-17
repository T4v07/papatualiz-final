import { pool } from "@/utils/db";
import cookie from "cookie";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ success: false });

  const { token } = req.query;

  try {
    const [pendentes] = await pool.query(
      `SELECT * FROM Compra_Pendente WHERE ID_token = ?`,
      [token]
    );

    if (pendentes.length === 0) {
      return res.status(400).json({ success: false, message: "Token inválido ou expirado" });
    }

    const tentativa = pendentes[0];
    const criado = new Date(tentativa.Criado_em);
    const agora = new Date();
    const diff = (agora - criado) / 1000;

    if (diff > 300) {
      return res.status(400).json({ success: false, message: "Token expirado" });
    }

    const dados = typeof tentativa.Dados === "string"
      ? JSON.parse(tentativa.Dados)
      : tentativa.Dados;

    const { carrinho, total } = dados;

    // 1. Registra a compra
    const [compraResult] = await pool.query(
      `INSERT INTO Compra (Data_compra, Total_Valor, ID_utilizador) VALUES (NOW(), ?, ?)`,
      [total, tentativa.ID_utilizador]
    );

    const id_compra = compraResult.insertId;

    // 2. Insere os produtos
    for (const item of carrinho) {
      await pool.query(
        `INSERT INTO Compra_Produto (ID_compra, ID_produto, Quantidade, Preco_unitario) VALUES (?, ?, ?, ?)`,
        [id_compra, item.ID_produto, item.Quantidade, item.Preco]
      );

      // 3. Atualiza o stock
      await pool.query(
        `UPDATE Produtos SET Stock = Stock - ? WHERE ID_produto = ?`,
        [item.Quantidade, item.ID_produto]
      );
    }

    // 4. Cria a encomenda
    const rastreio = "#SPORTS-ET-" + Math.floor(1000 + Math.random() * 9000);
    await pool.query(
      `INSERT INTO Encomenda (ID_compra, Estado, Codigo_rastreio) VALUES (?, 'pendente', ?)`,
      [id_compra, rastreio]
    );

    // 5. Limpa o carrinho e remove o token
    await pool.query(`DELETE FROM Carrinho WHERE ID_utilizador = ?`, [tentativa.ID_utilizador]);
    await pool.query(`DELETE FROM Compra_Pendente WHERE ID_token = ?`, [token]);

    // 6. Define cookie para liberar /encomenda
    res.setHeader("Set-Cookie", cookie.serialize("compra_confirmada", "true", {
      path: "/",
      maxAge: 900 // 15 minutos
    }));

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Erro ao confirmar compra:", err);
    return res.status(500).json({ success: false, message: "Erro interno" });
  }
}
