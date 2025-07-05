import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Corrigido: nome da tabela no singular "Categoria"
      const [categorias] = await pool.query("SELECT * FROM Categoria");
      res.status(200).json(categorias);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      res.status(500).json({ message: "Erro ao buscar categorias" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
