// /pages/api/encomenda-detalhes.js
import { pool } from "@/utils/db";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) return res.status(400).json({ message: "ID da encomenda é obrigatório." });

  try {
    const [encomendaRes] = await pool.query(
      `SELECT * FROM Encomenda WHERE ID_encomenda = ?`,
      [id]
    );
    const encomenda = encomendaRes[0];
    if (!encomenda) return res.status(404).json({ message: "Encomenda não encontrada." });

    const [compraRes] = await pool.query(
      `SELECT * FROM Compra_Produto CP
       JOIN Produtos P ON CP.ID_produto = P.ID_produto
       WHERE CP.ID_compra = ?`,
      [encomenda.ID_compra]
    );

    res.status(200).json({ ...encomenda, produtos: compraRes });
  } catch (err) {
    console.error("Erro ao buscar detalhes da encomenda:", err);
    res.status(500).json({ message: "Erro interno" });
  }
}
