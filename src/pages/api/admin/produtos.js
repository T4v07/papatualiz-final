// src/pages/api/admin/produtos.js
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { pool } from "@/utils/db";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      fs.mkdirSync(uploadDir, { recursive: true });

      const form = formidable({
        uploadDir,
        keepExtensions: true,
        maxFileSize: 5 * 1024 * 1024, // 5MB
        filter: ({ mimetype }) => mimetype && mimetype.startsWith("image"),
      });

      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error("Erro ao processar form:", err);
          return res.status(500).json({ message: "Erro ao processar formulário." });
        }

        const {
          nome,
          modelo,
          marca,
          cor,
          preco,
          stock,
          tipoCategoria,
          descricao,
        } = fields;

        if (!nome || !modelo || !marca || !preco || !stock || !tipoCategoria) {
          return res.status(400).json({ message: "Campos obrigatórios não preenchidos." });
        }

        const fotoFile = files.foto?.[0];
        const fotoPath = fotoFile ? "/uploads/" + path.basename(fotoFile.filepath) : null;

        await pool.execute(
          `INSERT INTO Produtos 
          (Nome_Produtos, Modelo, Marca, Cor, Preco, Stock, Tipo_de_Categoria, Descricao, Foto)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            nome[0],
            modelo[0],
            marca[0],
            cor?.[0] || "",
            preco[0],
            stock[0],
            tipoCategoria[0],
            descricao?.[0] || "",
            fotoPath,
          ]
        );

        return res.status(201).json({ message: "Produto adicionado com sucesso!" });
      });
    } catch (err) {
      console.error("Erro no POST:", err);
      return res.status(500).json({ message: "Erro ao processar produto." });
    }
  }

  if (req.method === "GET") {
    try {
      const [produtos] = await pool.query(`
        SELECT 
          p.ID_produto,
          p.Nome_Produtos,
          p.Modelo,
          p.Marca,
          p.Cor,
          p.Preco,
          p.Stock,
          p.Descricao,
          p.Foto,
          c.Tipo_de_Produto,
          c.Tipo_de_Categoria
        FROM Produtos p
        JOIN Categoria c ON p.Tipo_de_Categoria = c.ID_categoria
      `);

      return res.status(200).json(produtos);
    } catch (err) {
      console.error("Erro no GET:", err);
      return res.status(500).json({ message: "Erro ao buscar produtos." });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ message: `Método ${req.method} não permitido` });
}
