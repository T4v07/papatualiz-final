import { pool } from "@/utils/db";

export default async function handler(req, res) {
  const method = req.method;

  switch (method) {
    case "PUT":
      try {
        const {
          id,
          nome, modelo, marca, marcaOutro, genero, generoOutro, idade, idadeOutro,
          preco, peso, descricao, tipoCategoria, fichaTecnica, material, materialOutro,
          usoRecomendado, garantia, tecnologia, tecnologiaOutro, origem, origemOutro,
          desconto, novo, variacoes
        } = req.body;

        if (!id) {
          return res.status(400).json({ message: "ID do produto é obrigatório" });
        }

        // Atualiza dados do produto
        await pool.query(
          `UPDATE Produtos SET
            Nome_Produtos = ?, Modelo = ?, Marca = ?, MarcaOutro = ?, Genero = ?, GeneroOutro = ?,
            Idade = ?, Idade_Outro = ?, Preco = ?, Peso = ?, Descricao = ?, Tipo_de_Categoria = ?,
            Ficha_Tecnica = ?, Material = ?, Material_Outro = ?, Uso_Recomendado = ?, Garantia = ?,
            Tecnologia = ?, Tecnologia_Outro = ?, Origem = ?, Origem_Outro = ?, Desconto = ?, Novo = ?
          WHERE ID_produto = ?`,
          [
            nome, modelo, marca, marcaOutro, genero, generoOutro,
            idade, idadeOutro, preco, peso, descricao, tipoCategoria,
            fichaTecnica, material, materialOutro, usoRecomendado, garantia,
            tecnologia, tecnologiaOutro, origem, origemOutro, desconto, novo,
            id
          ]
        );

        // Apaga variações antigas
        await pool.query(`DELETE FROM ProdutoVariacoes WHERE produto_id = ?`, [id]);

        // Insere novas variações
        if (variacoes && Array.isArray(variacoes)) {
          for (const v of variacoes) {
            await pool.query(
              `INSERT INTO ProdutoVariacoes (produto_id, cor, tamanho, stock) VALUES (?, ?, ?, ?)`,
              [id, v.cor, v.tamanho, v.stock]
            );
          }
        }

        return res.status(200).json({ message: "Produto atualizado com sucesso" });
      } catch (error) {
        console.error("Erro ao atualizar produto:", error);
        return res.status(500).json({ message: "Erro ao atualizar produto" });
      }

    default:
      res.setHeader("Allow", ["PUT"]);
      return res.status(405).end(`Método ${method} não permitido`);
  }
}
