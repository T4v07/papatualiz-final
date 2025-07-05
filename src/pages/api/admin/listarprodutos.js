import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const [produtos] = await pool.query("SELECT * FROM Produtos");
      res.status(200).json(produtos);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      res.status(500).json({ message: "Erro ao buscar produtos" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
