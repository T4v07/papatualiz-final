import { pool } from "@/utils/db";

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === "GET") {
      const [rows] = await pool.query(
        "SELECT ID_categoria, Tipo_de_Produto, Tipo_de_Categoria FROM Categoria"
      );
      return res.status(200).json(rows);
    }

    if (method === "POST") {
      const { tipoProduto, tipoCategoria } = req.body;
      if (!tipoProduto || !tipoCategoria)
        return res.status(400).json({ message: "Dados incompletos" });

      await pool.execute(
        "INSERT INTO Categoria (Tipo_de_Produto, Tipo_de_Categoria) VALUES (?, ?)",
        [tipoProduto, tipoCategoria]
      );
      return res.status(201).json({ message: "Categoria adicionada!" });
    }

    if (method === "DELETE") {
      const { id } = req.query;
      await pool.execute("DELETE FROM Categoria WHERE ID_categoria = ?", [id]);
      return res.status(200).json({ message: "Categoria apagada!" });
    }

    if (method === "PUT") {
      const { id, tipoProduto, tipoCategoria } = req.body;
      await pool.execute(
        "UPDATE Categoria SET Tipo_de_Produto = ?, Tipo_de_Categoria = ? WHERE ID_categoria = ?",
        [tipoProduto, tipoCategoria, id]
      );
      return res.status(200).json({ message: "Categoria atualizada!" });
    }

    res.setHeader("Allow", ["GET", "POST", "DELETE", "PUT"]);
    res.status(405).end(`Método ${method} não permitido`);
  } catch (err) {
    console.error("Erro ao processar categorias:", err);
    res.status(500).json({ message: "Erro no servidor" });
  }
}
