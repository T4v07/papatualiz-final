import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { produtos } = req.body;
  const idUtilizador = 24; // ← ID fixo para simulação (depois pode ser auth)

  if (!produtos || produtos.length === 0) {
    return res.status(400).json({ message: "Carrinho vazio" });
  }

  try {
    const total = produtos.reduce(
      (acc, item) => acc + item.Preco * item.quantidade,
      0
    );

    const [result] = await pool.query(
      "INSERT INTO Compra (Data_compra, Total_Valor, ID_utilizador) VALUES (NOW(), ?, ?)",
      [total, idUtilizador]
    );

    const idCompra = result.insertId;

    for (const item of produtos) {
      await pool.query(
        "INSERT INTO Compra_Produto (ID_compra, ID_produto, Quantidade) VALUES (?, ?, ?)",
        [idCompra, item.ID_produto, item.quantidade]
      );
    }

    return res.status(201).json({ message: "Compra finalizada com sucesso!" });
  } catch (err) {
    console.error("Erro ao finalizar compra:", err);
    return res.status(500).json({ message: "Erro ao finalizar compra" });
  }
}
