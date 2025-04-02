import { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import styles from "@/styles/carrinho.module.css";

export default function Carrinho() {
  const { user } = useContext(AuthContext);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.ID_utilizador) {
      fetch(`/api/carrinho?id=${user.ID_utilizador}`)
        .then((res) => res.json())
        .then((data) => setProdutos(data));
    }
  }, [user]);

  const removerProduto = async (idProduto) => {
    const res = await fetch("/api/carrinho", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_utilizador: user.ID_utilizador,
        id_produto: idProduto,
      }),
    });

    if (res.ok) {
      setProdutos((prev) => prev.filter((p) => p.ID_produto !== idProduto));
    }
  };

  const limparCarrinho = async () => {
    await fetch("/api/carrinho", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_utilizador: user.ID_utilizador }),
    });

    setProdutos([]);
  };

  const finalizarCompra = async () => {
    setLoading(true);
    const res = await fetch("/api/compra", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_utilizador: user.ID_utilizador }),
    });

    if (res.ok) {
      setProdutos([]);
    }
    setLoading(false);
  };

  const total = produtos.reduce((acc, item) => acc + item.Preco * item.Quantidade, 0);

  return (
    <div className={styles.container}>
     <h2 className={styles.titulo}>Carrinho</h2>


      {produtos.length === 0 ? (
        <div className={styles.vazio}>
          <img src="/images/carrinho-vazio.png" alt="Carrinho vazio" />
          <p>O carrinho está vazio!</p>
          <a href="/">Continuar a comprar</a>
        </div>
      ) : (
        <>
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Preço</th>
                <th>Qtd</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((item) => (
                <tr key={item.ID_produto}>
                  <td>{item.Nome_Produtos}</td>
                  <td>{item.Preco.toFixed(2)} €</td>
                  <td>{item.Quantidade}</td>
                  <td>{(item.Preco * item.Quantidade).toFixed(2)} €</td>
                  <td>
                    <button onClick={() => removerProduto(item.ID_produto)}>
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.resumo}>
            <p>Total: <strong>{total.toFixed(2)} €</strong></p>

            <div className={styles.botoes}>
              <button onClick={limparCarrinho} className={styles.limpar}>
                Limpar Carrinho
              </button>

              <button onClick={finalizarCompra} disabled={loading}>
                {loading ? "Finalizando..." : "Finalizar Compra"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
