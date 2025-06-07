import { pool } from '@/utils/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { id } = req.query;

  try {
    const [rows] = await pool.execute(`
      SELECT p.*, c.Tipo_de_Produto, c.Tipo_de_Categoria
      FROM Produtos p
      JOIN Categoria c ON p.Tipo_de_Categoria = c.ID_categoria
      WHERE p.ID_produto = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Erro na API de produto por ID:", error);
    res.status(500).json({ message: 'Erro ao buscar produto' });
  }
}
