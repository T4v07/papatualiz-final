import { useEffect, useState } from "react";
import SidebarAdmin from "@/components/admin/SidebarAdmin";
import styles from "@/styles/estoque.module.css";

export default function ControleEstoque() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    fetch("/api/admin/estoque")
      .then((res) => res.json())
      .then((data) => setProdutos(data));
  }, []);

  const atualizarStock = async (id, novoStock) => {
    if (isNaN(novoStock) || novoStock < 0) return;

    const res = await fetch("/api/admin/estoque", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_produto: id, novo_stock: Number(novoStock) }),
    });

    if (res.ok) {
      setProdutos((prev) =>
        prev.map((p) =>
          p.ID_produto === id ? { ...p, Stock: Number(novoStock) } : p
        )
      );
    }
  };

  const stockCritico = (qtd) => qtd < 5;

  const filtrar = produtos.filter((p) =>
    p.Nome_Produtos.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className={styles.wrapper}>
      <SidebarAdmin />
      <div className={styles.conteudo}>
        <h2 className={styles.titulo}>Controle de Estoque</h2>

        <input
          type="text"
          className={styles.filtro}
          placeholder="🔍 Procurar produto..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        <div className={styles.tabelaContainer}>
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Produto</th>
                <th>Marca</th>
                <th>Stock</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtrar.map((produto) => (
                <tr
                  key={produto.ID_produto}
                  className={stockCritico(produto.Stock) ? styles.critico : ""}
                >
                  <td>{produto.ID_produto}</td>
                  <td>{produto.Nome_Produtos}</td>
                  <td>{produto.Marca}</td>
                  <td>{produto.Stock}</td>
                  <td className={styles.acoes}>
                    <button
                      onClick={() =>
                        atualizarStock(
                          produto.ID_produto,
                          produto.Stock - 1
                        )
                      }
                    >
                      ➖
                    </button>
                    <button
                      onClick={() =>
                        atualizarStock(
                          produto.ID_produto,
                          produto.Stock + 1
                        )
                      }
                    >
                      ➕
                    </button>
                  </td>
                </tr>
              ))}
              {filtrar.length === 0 && (
                <tr>
                  <td colSpan="5" className={styles.semResultados}>
                    Nenhum produto encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
