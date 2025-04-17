// pages/api/funcionario/produtos.js
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
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    fs.mkdirSync(uploadDir, { recursive: true });

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024,
      filter: ({ mimetype }) => mimetype && mimetype.startsWith("image"),
    });

    try {
      const [fields, files] = await form.parse(req);

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

      const fotoFile = files.foto?.[0] || null;
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

      return res.status(201).json({ message: "Produto adicionado!" });
    } catch (err) {
      console.error("Erro ao adicionar produto:", err);
      return res.status(500).json({ message: "Erro ao adicionar produto." });
    }
  }

  return res.status(405).json({ message: "Método não permitido." });
}
