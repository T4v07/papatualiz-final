import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { pool } from "@/utils/db";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const [rows] = await pool.query(`
        SELECT p.*, c.Tipo_de_Categoria
        FROM Produtos p
        LEFT JOIN Categoria c ON p.Tipo_de_Categoria = c.ID_categoria
        ORDER BY p.ID_produto DESC
      `);
      return res.status(200).json(rows);
    } catch (err) {
      console.error("Erro no GET:", err);
      return res.status(500).json({ error: "Erro ao buscar produtos." });
    }
  }

  if (req.method === "POST") {
    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), "public/uploads"),
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Erro ao processar form:", err);
        return res.status(500).json({ error: "Erro ao processar formulário." });
      }

      const {
        nome, modelo, marca, marcaOutro, genero, generoOutro, idade, idadeOutro,
        cor, corOutro, descricao, fichaTecnica, preco, peso, stock,
        material, materialOutro, usoRecomendado, garantia,
        tecnologia, tecnologiaOutro, origem, origemOutro,
        desconto, novo, tipoCategoria,
        tamanhoRoupa, tamanhoCalcado, tamanhoObjeto
      } = fields;

      let nomeImagem = "";
      if (files.foto && files.foto[0]) {
        const oldPath = files.foto[0].filepath;
        const ext = path.extname(files.foto[0].originalFilename || ".jpg");
        nomeImagem = `${uuidv4()}${ext}`;
        const newPath = path.join(process.cwd(), "public/uploads", nomeImagem);
        fs.renameSync(oldPath, newPath);
      }

      try {
        const query = `
          INSERT INTO Produtos (
            Nome_Produtos, Modelo, Marca, MarcaOutro, Genero, GeneroOutro,
            Idade, Idade_Outro, Cor, Cor_Outro, Descricao, Ficha_Tecnica,
            Preco, Peso, Stock, Material, Material_Outro, Uso_Recomendado,
            Garantia, Tecnologia, Tecnologia_Outro, Origem, Origem_Outro,
            Desconto, Novo, Tipo_de_Categoria, Tamanho_Roupa, Tamanho_Calcado,
            Tamanho_Objeto, Foto
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
          nome || "", modelo || "", marca || "", marcaOutro || "",
          genero || "", generoOutro || "", idade || "", idadeOutro || "",
          cor || "", corOutro || "", descricao || "", fichaTecnica || "",
          parseFloat(preco) || 0, peso || "", parseInt(stock) || 0,
          material || "", materialOutro || "", usoRecomendado || "",
          garantia || "", tecnologia || "", tecnologiaOutro || "",
          origem || "", origemOutro || "", parseInt(desconto) || 0,
          novo === "Sim" ? 1 : 0,
          parseInt(tipoCategoria) || null,
          tamanhoRoupa || "", tamanhoCalcado || "", tamanhoObjeto || "",
          nomeImagem
        ];

        await pool.query(query, values);
        return res.status(200).json({ mensagem: "Produto guardado com sucesso." });
      } catch (err) {
        console.error("Erro no INSERT:", err);
        return res.status(500).json({ error: "Erro ao guardar produto." });
      }
    });
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Método ${req.method} não permitido.` });
  }
}
