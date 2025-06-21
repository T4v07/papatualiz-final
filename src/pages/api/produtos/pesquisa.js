// pages/api/produtos/pesquisa.js
import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { q } = req.query;

  if (!q || q.trim() === '') {
    return res.status(400).json({ message: 'Parâmetro de pesquisa inválido' });
  }

  try {
    const termo = `%${q}%`;

    const [rows] = await pool.query(
      `
      SELECT 
        p.ID_produto,
        p.Nome_Produtos,
        p.Modelo,
        p.Marca,
        p.Cor,
        p.Preco,
        p.Stock,
        p.Desconto,
        p.Foto,
        p.Genero,
        p.Idade,
        p.Tamanho_Roupa,
        p.Tamanho_Calcado,
        p.Tamanho_Objeto,
        p.Tecnologia,
        p.Origem,
        p.Material,
        p.Uso_Recomendado,
        p.Novo AS Novidade,
        p.Descricao,
        c.Tipo_de_Categoria AS Tipo_de_Categoria
      FROM Produtos p
      LEFT JOIN Categoria c ON p.Tipo_de_Categoria = c.ID_categoria
      WHERE 
        p.Nome_Produtos LIKE ? OR 
        p.Marca LIKE ? OR 
        p.Cor LIKE ? OR 
        p.Material LIKE ? OR
        p.Tecnologia LIKE ? OR
        p.Descricao LIKE ? OR
        c.Tipo_de_Categoria LIKE ?
      `,
      [termo, termo, termo, termo, termo, termo, termo]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("❌ ERRO MYSQL:", error); // Mostra no terminal o erro real
    res.status(500).json({ message: "Erro interno ao buscar produtos", erro: error.message });
  }
}
