import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";
import { pool } from "@/utils/db";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: { bodyParser: false },
};

function sanitizar(valor) {
  if (valor === undefined || valor === "") return null;
  if (!isNaN(valor)) return parseFloat(valor);
  if (typeof valor === "string" && valor.length > 255) return valor.substring(0, 255);
  return valor;
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const form = formidable({ keepExtensions: true, multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ message: "Erro no processamento." });

      try {
        const fotosFiles = files.fotos || [];
        const fotosArray = Array.isArray(fotosFiles) ? fotosFiles : [fotosFiles];
        const variacoes = JSON.parse(fields.variacoes || "[]");

        const produtoDados = {
          nome: sanitizar(fields.nome),
          modelo: sanitizar(fields.modelo),
          marca: sanitizar(fields.marca),
          marcaOutro: sanitizar(fields.MarcaOutro),
          genero: sanitizar(fields.genero),
          generoOutro: sanitizar(fields.GeneroOutro),
          idade: sanitizar(fields.idade),
          idadeOutro: sanitizar(fields.Idade_Outro),
          preco: sanitizar(fields.preco),
          peso: sanitizar(fields.peso),
          descricao: sanitizar(fields.descricao),
          tipoCategoria: parseInt(fields.tipoCategoria),
          fichaTecnica: sanitizar(fields.Ficha_Tecnica),
          material: sanitizar(fields.material),
          materialOutro: sanitizar(fields.Material_Outro),
          usoRecomendado: sanitizar(fields.Uso_Recomendado),
          garantia: sanitizar(fields.garantia),
          tecnologia: sanitizar(fields.tecnologia),
          tecnologiaOutro: sanitizar(fields.Tecnologia_Outro),
          origem: sanitizar(fields.origem),
          origemOutro: sanitizar(fields.Origem_Outro),
          desconto: sanitizar(fields.desconto),
          novo: fields.novo === "Sim" ? 1 : 0,
        };

        const fotosUrls = [];
        for (const foto of fotosArray) {
          const uploadResult = await cloudinary.uploader.upload(foto.filepath, {
            folder: "produtos",
          });
          fotosUrls.push(uploadResult.secure_url);
        }

        const [result] = await pool.execute(
          `INSERT INTO Produtos (
            Nome_Produtos, Modelo, Marca, MarcaOutro, Genero, GeneroOutro,
            Idade, Idade_Outro, Preco, Peso, Descricao, Tipo_de_Categoria,
            Ficha_Tecnica, Material, Material_Outro, Uso_Recomendado, Garantia,
            Tecnologia, Tecnologia_Outro, Origem, Origem_Outro, Desconto, Novo, Ativo
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
          [
            produtoDados.nome,
            produtoDados.modelo,
            produtoDados.marca,
            produtoDados.marcaOutro,
            produtoDados.genero,
            produtoDados.generoOutro,
            produtoDados.idade,
            produtoDados.idadeOutro,
            produtoDados.preco,
            produtoDados.peso,
            produtoDados.descricao,
            produtoDados.tipoCategoria,
            produtoDados.fichaTecnica,
            produtoDados.material,
            produtoDados.materialOutro,
            produtoDados.usoRecomendado,
            produtoDados.garantia,
            produtoDados.tecnologia,
            produtoDados.tecnologiaOutro,
            produtoDados.origem,
            produtoDados.origemOutro,
            produtoDados.desconto,
            produtoDados.novo,
          ]
        );

        const produtoId = result.insertId;

        for (const url of fotosUrls) {
          await pool.execute(
            `INSERT INTO ProdutoFotos (produto_id, url) VALUES (?, ?)`,
            [produtoId, url]
          );
        }

        for (const variacao of variacoes) {
          await pool.execute(
            `INSERT INTO ProdutoVariacoes (produto_id, cor, tamanho, stock) VALUES (?, ?, ?, ?)`,
            [produtoId, variacao.cor, variacao.tamanho, variacao.stock]
          );
        }

        return res.status(201).json({ message: "Produto adicionado com sucesso!" });
      } catch (error) {
        console.error("Erro geral:", error);
        return res.status(500).json({ message: "Erro interno ao salvar produto." });
      }
    });

    return;
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).json({ message: `Método ${req.method} não permitido.` });
}
