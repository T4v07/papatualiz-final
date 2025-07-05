// pages/api/admin/atualizarfotos.js
import { IncomingForm } from "formidable";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { pool } from "@/utils/db";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false, // desabilitar body parser padrão para formidable funcionar
  },
};

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const form = new IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ message: "Erro ao processar formulário" });

    try {
      const produtoId = fields.produtoId;
      if (!produtoId) return res.status(400).json({ message: "produtoId é obrigatório" });

      // Fotos antigas enviadas como JSON string com URLs
      let fotosAntigas = [];
      if (fields.fotosAntigas) {
        fotosAntigas = JSON.parse(fields.fotosAntigas);
      }

      // Apagar fotos removidas (que estão no banco mas não no array enviado)
      await pool.query(
        "DELETE FROM ProdutoFotos WHERE produto_id = ? AND url NOT IN (?)",
        [produtoId, fotosAntigas.length > 0 ? fotosAntigas : [""]]
      );

      // Upload das novas fotos para Cloudinary
      const arquivos = files.fotos;
      let fotosNovasUrls = [];

      if (arquivos) {
        const arquivosArray = Array.isArray(arquivos) ? arquivos : [arquivos];

        for (const arquivo of arquivosArray) {
          const uploadResult = await cloudinary.uploader.upload(arquivo.filepath, {
            folder: `produtos/${produtoId}`,
          });
          fotosNovasUrls.push(uploadResult.secure_url);
        }

        // Inserir URLs das fotos novas no banco
        for (const url of fotosNovasUrls) {
          await pool.query(
            "INSERT INTO ProdutoFotos (produto_id, url, ordem) VALUES (?, ?, ?)",
            [produtoId, url, 0]
          );
        }
      }

      res.status(200).json({ message: "Fotos atualizadas com sucesso", fotosNovasUrls, fotosAntigas });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });
}
