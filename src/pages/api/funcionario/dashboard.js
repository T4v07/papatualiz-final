//pages/api/funcionario/dashboard.js
import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  try {
    const [[{ totalProdutos }]] = await pool.query("SELECT COUNT(*) AS totalProdutos FROM Produtos");
    const [[{ totalCompras }]] = await pool.query("SELECT COUNT(*) AS totalCompras FROM Compra");
    const [[{ encomendasPendentes }]] = await pool.query("SELECT COUNT(*) AS encomendasPendentes FROM Encomenda WHERE Estado = 'pendente'");
    const [[{ stockCritico }]] = await pool.query("SELECT COUNT(*) AS stockCritico FROM Produtos WHERE Stock < 5");

    res.status(200).json({
      totalProdutos,
      totalCompras,
      encomendasPendentes,
      stockCritico
    });
  } catch (error) {
    console.error("Erro na dashboard do funcionário:", error);
    res.status(500).json({ message: "Erro ao obter dados" });
  }
}
