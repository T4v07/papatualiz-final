// pages/api/funcionario/categorias.js
import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  try {
    const [categorias] = await pool.query(`
      SELECT ID_categoria, Tipo_de_Produto, Tipo_de_Categoria
      FROM Categoria
      ORDER BY Tipo_de_Categoria ASC
    `);

    return res.status(200).json(categorias);
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return res.status(500).json({ message: "Erro ao buscar categorias." });
  }
}
