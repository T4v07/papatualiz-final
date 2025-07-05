import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).end(`Método ${req.method} não permitido`);
  }

  const { id, ativo } = req.body;

  if (typeof id === "undefined" || typeof ativo === "undefined") {
    return res.status(400).json({ message: "ID e estado ativo são obrigatórios" });
  }

  try {
    await pool.query("UPDATE Produtos SET Ativo = ? WHERE ID_produto = ?", [ativo ? 1 : 0, id]);
    return res.status(200).json({ message: "Estado atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar estado do produto:", error);
    return res.status(500).json({ message: "Erro ao atualizar estado do produto" });
  }
}
