// pages/api/categorias.js
import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const [categorias] = await pool.query("SELECT * FROM Categoria");
      return res.status(200).json(categorias);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      return res.status(500).json({ message: "Erro ao buscar categorias." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: `Método ${req.method} não permitido.` });
  }
}
