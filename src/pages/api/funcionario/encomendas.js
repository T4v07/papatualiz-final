// pages/api/funcionario/encomendas.js
import { pool } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  try {
    const [encomendas] = await pool.query(`
      SELECT 
        ID_encomenda,
        ID_compra,
        Estado,
        Codigo_rastreio,
        Endereco_entrega,
        Rua,
        Numero,
        Codigo_postal,
        Cidade,
        Pais
      FROM Encomenda
      ORDER BY ID_encomenda DESC
    `);

    // Montar morada completa caso os campos existam
    const encomendasCompletas = encomendas.map((e) => ({
      ...e,
      Endereco_entrega:
        e.Rua && e.Numero && e.Codigo_postal && e.Cidade && e.Pais
          ? `Rua ${e.Rua}, nº ${e.Numero}, ${e.Codigo_postal} - ${e.Cidade}, ${e.Pais}`
          : e.Endereco_entrega || "Morada não disponível",
    }));

    res.status(200).json(encomendasCompletas);
  } catch (error) {
    console.error("Erro ao buscar encomendas:", error);
    res.status(500).json({ message: "Erro interno ao buscar encomendas." });
  }
}
