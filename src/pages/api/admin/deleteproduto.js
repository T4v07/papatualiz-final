import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { id } = req.query;
    if (!id) return res.status(400).json({ message: "ID do produto é obrigatório" });

    try {
      await pool.query("DELETE FROM Produtos WHERE ID_produto = ?", [id]);
      return res.status(200).json({ message: "Produto eliminado com sucesso" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao eliminar produto" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Método ${req.method} não permitido`);
  }
}
