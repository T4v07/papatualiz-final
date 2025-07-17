import { pool } from "@/utils/db";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ mensagem: "Método não permitido" });
  }

  const {
    usuario_id,
    nome,
    apelido,
    morada,
    numero,
    codpostal,
    localidade,
    telefone,
    email,
    observacoes,
    subtotal,
    frete,
    desconto = 0,
  } = req.body;

  if (
    !usuario_id ||
    !nome ||
    !apelido ||
    !morada ||
    !codpostal ||
    !localidade ||
    !telefone ||
    !email ||
    subtotal === undefined ||
    frete === undefined
  ) {
    return res.status(400).json({ mensagem: "Dados obrigatórios em falta." });
  }

  const ID_compra = uuidv4();
  const total = parseFloat(subtotal) + parseFloat(frete) - parseFloat(desconto);

  try {
    const [produtos] = await pool.execute(
      `
      SELECT c.ID_produto, c.ID_produto_variacao, c.Quantidade, p.Preco
      FROM Carrinho c
      JOIN Produtos p ON c.ID_produto = p.ID_produto
      WHERE c.ID_utilizador = ?
      `,
      [usuario_id]
    );

    if (produtos.length === 0) {
      return res.status(400).json({ mensagem: "Carrinho vazio." });
    }

   await pool.execute(
    `
    INSERT INTO Encomenda (
      ID_compra,
      usuario_id,
      Endereco_entrega,
      Notas,
      Data_criacao,
      Estado,
      Rua,
      Numero,
      Codigo_postal,
      Cidade,
      Pais,
      nome,
      apelido,
      telefone,
      email,
      Subtotal,
      Frete,
      Total_Valor
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      ID_compra,
      usuario_id,
      `${morada}, Nº ${numero || "s/n"}, ${codpostal} ${localidade}`,
      observacoes || "",
      new Date(), // <- agora passamos a data aqui
      "pendente",
      morada,
      numero || "s/n",
      codpostal,
      localidade,
      "Portugal",
      nome,
      apelido,
      telefone,
      email,
      subtotal,
      frete,
      total,
    ]
  );


    const inseridos = new Set();
    for (const produto of produtos) {
      const chave = `${produto.ID_produto}-${produto.ID_produto_variacao}`;
      if (inseridos.has(chave)) continue;

      await pool.execute(
        `
        INSERT INTO Compra_Produto (
          ID_compra,
          ID_produto,
          ID_produto_variacao,
          Quantidade,
          Preco_unitario
        ) VALUES (?, ?, ?, ?, ?)
      `,
        [
          ID_compra,
          produto.ID_produto,
          produto.ID_produto_variacao,
          produto.Quantidade,
          produto.Preco,
        ]
      );
      inseridos.add(chave);
    }

    await pool.execute(`DELETE FROM Carrinho WHERE ID_utilizador = ?`, [
      usuario_id,
    ]);

    return res.status(200).json({
      mensagem: "Encomenda criada com sucesso",
      ID_compra,
    });
  } catch (error) {
    console.error("Erro ao criar encomenda:", error);
    return res.status(500).json({ mensagem: "Erro ao criar encomenda" });
  }
}
