// pages/api/funcionario/produtos.js
import { IncomingForm } from "formidable";
import { v2 as cloudinary } from "cloudinary";
import { pool } from "@/utils/db";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Configuração Cloudinary com variáveis de ambiente
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
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
      maxFileSize: 10 * 1024 * 1024, // 10MB
      keepExtensions: true,
      multiples: false,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Erro ao processar form:", err);
        return res.status(500).json({ error: "Erro ao processar formulário." });
      }
      // IMPORTANTE: certifique-se de ter as variáveis de ambiente configuradas
      const cloudinary = require('cloudinary').v2;

      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      let imageUrl = "";
      if (files.foto && files.foto[0]) {
        const filePath = files.foto[0].filepath;
        try {
          const result = await cloudinary.uploader.upload(filePath, {
            folder: "produtos",
          });
          imageUrl = result.secure_url;
        } catch (uploadErr) {
          console.error("Erro ao fazer upload para Cloudinary:", uploadErr);
          return res.status(500).json({ error: "Erro ao fazer upload da imagem." });
        }
      }

      const {
        nome, modelo, marca, marcaOutro, genero, generoOutro, idade, idadeOutro,
        cor, corOutro, descricao, fichaTecnica, preco, peso, stock,
        material, materialOutro, usoRecomendado, garantia,
        tecnologia, tecnologiaOutro, origem, origemOutro,
        desconto, novo, tipoCategoria,
        tamanhoRoupa, tamanhoCalcado, tamanhoObjeto
      } = fields;
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
          imageUrl // <- imagem da Cloudinary
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
