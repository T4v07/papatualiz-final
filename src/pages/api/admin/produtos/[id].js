// src/pages/api/admin/produtos/[id].js
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
  const { id } = req.query;

  if (req.method === "DELETE") {
    try {
      await pool.execute("DELETE FROM Produtos WHERE ID_produto = ?", [id]);
      return res.status(200).json({ message: "Produto eliminado com sucesso." });
    } catch (err) {
      console.error("Erro ao eliminar produto:", err);
      return res.status(500).json({ message: "Erro ao eliminar produto." });
    }
  }

  if (req.method === "PUT") {
    const form = formidable({ multiples: false, uploadDir: "./public/uploads", keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Erro ao processar o formulário:", err);
        return res.status(500).json({ message: "Erro ao processar o formulário" });
      }

      try {
        const foto = files.foto?.[0] || files.foto;
        let fotoPath = null;

        if (foto && foto.filepath) {
          const nomeFinal = `${Date.now()}-${foto.originalFilename}`;
          const destPath = path.join(process.cwd(), "public/uploads", nomeFinal);
          fs.renameSync(foto.filepath, destPath);
          fotoPath = `/uploads/${nomeFinal}`;
        }

        const values = {};
        for (const [key, val] of Object.entries(fields)) {
          values[key] = Array.isArray(val) ? val[0] : val;
        }

        const [existing] = await pool.query("SELECT Foto FROM Produtos WHERE ID_produto = ?", [id]);
        const fotoFinal = fotoPath || existing[0]?.Foto || null;

        const query = `
          UPDATE Produtos SET
            Nome_Produtos=?, Modelo=?, Marca=?, MarcaOutro=?,
            Genero=?, GeneroOutro=?, Idade=?, Idade_Outro=?,
            Cor=?, Cor_Outro=?, Foto=?,
            Preco=?, Peso=?, Stock=?, Material=?, Material_Outro=?,
            Uso_Recomendado=?, Garantia=?, Tecnologia=?, Tecnologia_Outro=?,
            Origem=?, Origem_Outro=?, Desconto=?, Novo=?,
            Tipo_de_Categoria=?, Ficha_Tecnica=?,
            Tamanho_Roupa=?, Tamanho_Calcado=?, Tamanho_Objeto=?
          WHERE ID_produto = ?
        `;

        const parametros = [
          values.nome, values.modelo, values.marca, values.marcaOutro,
          values.genero, values.generoOutro, values.idade, values.idadeOutro,
          values.cor, values.corOutro, fotoFinal,
          parseFloat(values.preco || 0), parseFloat(values.peso || 0), parseInt(values.stock || 0),
          values.material, values.materialOutro, values.usoRecomendado, values.garantia,
          values.tecnologia, values.tecnologiaOutro, values.origem, values.origemOutro,
          parseInt(values.desconto || 0), values.novo === "Sim" ? 1 : 0,
          parseInt(values.tipoCategoria || 0), values.fichaTecnica,
          values.tamanhoRoupa, values.tamanhoCalcado, values.tamanhoObjeto,
          id
        ];

        await pool.execute(query, parametros);

        res.status(200).json({ message: "Produto atualizado com sucesso." });
      } catch (error) {
        console.error("Erro ao atualizar produto:", error);
        res.status(500).json({ message: "Erro ao atualizar o produto." });
      }
    });
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).json({ message: `Método ${req.method} não permitido.` });
  }
}
