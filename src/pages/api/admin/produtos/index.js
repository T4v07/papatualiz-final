// pages/api/admin/produtos/index.js
import { pool } from "../../../../utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const [produtos] = await pool.query("SELECT * FROM Produtos");
      return res.status(200).json(produtos);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao buscar produtos" });
    }
  }

  if (req.method === "POST") {
    const { Nome_Produtos, Modelo, Marca, Cor, Foto, Preco, Tipo_de_Categoria, Descricao, Stock } = req.body;

    if (!Nome_Produtos || !Preco || !Tipo_de_Categoria) {
      return res.status(400).json({ message: "Campos obrigatórios não preenchidos." });
    }

    try {
      const [result] = await pool.query(
        `INSERT INTO Produtos 
         (Nome_Produtos, Modelo, Marca, Cor, Foto, Preco, Tipo_de_Categoria, Descricao, Stock)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [Nome_Produtos, Modelo, Marca, Cor, Foto, Preco, Tipo_de_Categoria, Descricao, Stock]
      );

      return res.status(201).json({ message: "Produto criado com sucesso!", id: result.insertId });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao criar produto." });
    }
  }

  return res.status(405).json({ message: "Método não permitido." });
}
