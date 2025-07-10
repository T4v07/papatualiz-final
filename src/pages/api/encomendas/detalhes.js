import { pool } from "@/utils/db";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) return res.status(400).json({ message: "ID da encomenda é obrigatório" });

  try {
    const [encomendas] = await pool.query(`
      SELECT 
        E.ID_encomenda,
        E.Estado,
        E.Codigo_rastreio,
        E.Endereco_entrega,
        E.Notas,
        E.Data_criacao,
        E.Rua,
        E.Numero,
        E.Codigo_postal,
        E.Cidade,
        E.Pais,
        E.usuario_id,
        U.nome,
        U.apelido,
        U.telefone,
        U.email,
        E.ID_compra,
        E.Subtotal,
        E.Frete,
        E.Total_Valor
      FROM Encomenda E
      LEFT JOIN Utilizador U ON E.usuario_id = U.ID_utilizador
      WHERE E.ID_encomenda = ?
      LIMIT 1
    `, [id]);

    if (encomendas.length === 0) {
      return res.status(404).json({ message: "Encomenda não encontrada" });
    }

    const encomenda = encomendas[0];

    const [produtos] = await pool.query(`
      SELECT P.Nome_Produtos, P.Marca, P.Preco, CP.quantidade
      FROM Compra_Produto CP
      JOIN Produto P ON CP.ID_produto = P.ID_produto
      WHERE CP.ID_compra = ?
    `, [encomenda.ID_compra]);

    res.status(200).json({ encomenda, produtos });
  } catch (error) {
    console.error("Erro ao buscar detalhes da encomenda:", error);
    res.status(500).json({ message: "Erro interno" });
  }
}
