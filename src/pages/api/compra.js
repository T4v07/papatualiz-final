import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { id_utilizador } = req.body;

    const [carrinho] = await pool.query(
      `SELECT ID_produto, Quantidade FROM Carrinho WHERE ID_utilizador = ?`,
      [id_utilizador]
    );

    if (carrinho.length === 0) {
      return res.status(400).json({ message: "Carrinho vazio" });
    }

    const total = carrinho.reduce((acc, item) => acc + item.Quantidade * 10, 0); // ajustar valor real se necessário

    const [compra] = await pool.query(
      `INSERT INTO Compra (Data_compra, Total_Valor, ID_utilizador) VALUES (NOW(), ?, ?)`,
      [total, id_utilizador]
    );

    const id_compra = compra.insertId;

    for (const item of carrinho) {
      await pool.query(
        `INSERT INTO Compra_Produto (ID_compra, ID_produto, Quantidade) VALUES (?, ?, ?)`,
        [id_compra, item.ID_produto, item.Quantidade]
      );
    }

    await pool.query(`DELETE FROM Carrinho WHERE ID_utilizador = ?`, [id_utilizador]);

    return res.status(200).json({ message: "Compra efetuada!" });
  }

  res.status(405).json({ message: "Método não permitido" });
}
