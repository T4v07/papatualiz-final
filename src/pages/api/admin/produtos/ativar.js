// /pages/api/admin/produtos/ativar.js
import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { id, ativo } = req.query;

  if (!id || typeof ativo === "undefined") {
    return res.status(400).json({ message: "Parâmetros inválidos" });
  }

  try {
    await pool.query("UPDATE Produtos SET Ativo = ? WHERE ID_produto = ?", [ativo, id]);
    return res.status(200).json({ message: `Produto ${ativo == 1 ? "ativado" : "desativado"} com sucesso.` });
  } catch (err) {
    console.error("Erro ao atualizar Ativo:", err);
    return res.status(500).json({ message: "Erro ao atualizar estado do produto." });
  }
}
