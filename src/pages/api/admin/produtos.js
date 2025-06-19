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
  if (!isNaN(valor)) return valor;
  return valor;
}

export default async function handler(req, res) {
  if (req.method === "POST" || req.method === "PUT") {
    const form = formidable({ keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ message: "Erro no processamento." });

      try {
        let fotoUrl = null;
        const file = files.foto?.[0];

        if (file) {
          const uploaded = await cloudinary.uploader.upload(file.filepath, {
            folder: "produtos",
          });
          fotoUrl = uploaded.secure_url;
        }

        const values = {
          id: sanitizar(fields.id?.[0]),
          nome: sanitizar(fields.nome?.[0]),
          modelo: sanitizar(fields.modelo?.[0]),
          marca: sanitizar(fields.marca?.[0]),
          genero: sanitizar(fields.genero?.[0]),
          idade: sanitizar(fields.idade?.[0]),
          idadeOutro: sanitizar(fields.idadeOutro?.[0]),
          cor: sanitizar(fields.cor?.[0]),
          corOutro: sanitizar(fields.corOutro?.[0]),
          preco: sanitizar(parseFloat(fields.preco?.[0])),
          peso: sanitizar(parseFloat(fields.peso?.[0])),
          descricao: sanitizar(fields.descricao?.[0]),
          stock: sanitizar(parseInt(fields.stock?.[0])),
          tipoCategoria: sanitizar(parseInt(fields.tipoCategoria?.[0])),
          fichaTecnica: sanitizar(fields.fichaTecnica?.[0]),
          tamanhoRoupa: sanitizar(fields.tamanhoRoupa?.[0]),
          tamanhoInicial: sanitizar(fields.tamanhoInicial?.[0]),
          tamanhoFinal: sanitizar(fields.tamanhoFinal?.[0]),
          tamanhoCalcado: sanitizar(fields.tamanhoCalcado?.[0]),
          tamanhoObjeto: sanitizar(fields.tamanhoObjeto?.[0]),
          material: sanitizar(fields.material?.[0]),
          materialOutro: sanitizar(fields.materialOutro?.[0]),
          usoRecomendado: sanitizar(fields.usoRecomendado?.[0]),
          garantia: sanitizar(fields.garantia?.[0]),
          tecnologia: sanitizar(fields.tecnologia?.[0]),
          tecnologiaOutro: sanitizar(fields.tecnologiaOutro?.[0]),
          origem: sanitizar(fields.origem?.[0]),
          origemOutro: sanitizar(fields.origemOutro?.[0]),
          desconto: sanitizar(parseFloat(fields.desconto?.[0])),
          novo: fields.novo?.[0] === "Sim" ? 1 : 0,
          foto: fotoUrl,
        };

        if (req.method === "POST") {
          await pool.execute(`
            INSERT INTO Produtos (
              Nome_Produtos, Modelo, Marca, Genero, Idade, Idade_Outro,
              Cor, Cor_Outro, Foto, Preco, Peso, Descricao, Stock,
              Tipo_de_Categoria, Ficha_Tecnica,
              Tamanho_Roupa, Tamanho_Calcado, Tamanho_Objeto,
              Material, Material_Outro, Uso_Recomendado, Garantia,
              Tecnologia, Tecnologia_Outro, Origem, Origem_Outro,
              Desconto, Novo, Ativo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
          `, [
            values.nome, values.modelo, values.marca, values.genero, values.idade, values.idadeOutro,
            values.cor, values.corOutro, values.foto, values.preco, values.peso, values.descricao, values.stock,
            values.tipoCategoria, values.fichaTecnica,
            values.tamanhoRoupa, values.tamanhoCalcado, values.tamanhoObjeto,
            values.material, values.materialOutro, values.usoRecomendado, values.garantia,
            values.tecnologia, values.tecnologiaOutro, values.origem, values.origemOutro,
            values.desconto, values.novo
          ]);

          return res.status(201).json({ message: "Produto adicionado com sucesso!" });
        }

        if (req.method === "PUT") {
          const [existing] = await pool.query("SELECT Foto FROM Produtos WHERE ID_produto = ?", [values.id]);
          const fotoFinal = values.foto || existing[0]?.Foto || null;

          await pool.execute(`
            UPDATE Produtos SET
              Nome_Produtos=?, Modelo=?, Marca=?, Genero=?, Idade=?, Idade_Outro=?,
              Cor=?, Cor_Outro=?, Foto=?, Preco=?, Peso=?, Descricao=?, Stock=?,
              Tipo_de_Categoria=?, Ficha_Tecnica=?,
              Tamanho_Roupa=?, Tamanho_Calcado=?, Tamanho_Objeto=?,
              Tamanho_Inicial=?, Tamanho_Final=?,
              Material=?, Material_Outro=?, Uso_Recomendado=?, Garantia=?,
              Tecnologia=?, Tecnologia_Outro=?, Origem=?, Origem_Outro=?,
              Desconto=?, Novo=?
            WHERE ID_produto = ?
          `, [
            values.nome, values.modelo, values.marca, values.genero, values.idade, values.idadeOutro,
            values.cor, values.corOutro, fotoFinal, values.preco, values.peso, values.descricao, values.stock,
            values.tipoCategoria, values.fichaTecnica,
            values.tamanhoRoupa, values.tamanhoCalcado, values.tamanhoObjeto,
            values.tamanhoInicial, values.tamanhoFinal,
            values.material, values.materialOutro, values.usoRecomendado, values.garantia,
            values.tecnologia, values.tecnologiaOutro, values.origem, values.origemOutro,
            values.desconto, values.novo, values.id
          ]);

          return res.status(200).json({ message: "Produto atualizado com sucesso!" });
        }
      } catch (error) {
        console.error("Erro geral:", error);
        return res.status(500).json({ message: "Erro interno ao salvar produto." });
      }
    });
    return;
  }

  if (req.method === "GET") {
    try {
      const [produtos] = await pool.query(`
        SELECT 
          p.*, 
          c.Tipo_de_Produto, 
          c.Tipo_de_Categoria,
          c.ID_categoria AS ID_categoria
        FROM Produtos p
        JOIN Categoria c ON p.Tipo_de_Categoria = c.ID_categoria
      `);
      return res.status(200).json(produtos);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      return res.status(500).json({ message: "Erro ao buscar produtos." });
    }
  }

  res.setHeader("Allow", ["GET", "POST", "PUT"]);
  return res.status(405).json({ message: `Método ${req.method} não permitido.` });
}
