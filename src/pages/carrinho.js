// /pages/carrinho.js
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import Navbar from "@/components/navbar";
import styles from "@/styles/carrinho.module.css";
import { useRouter } from "next/router";

export default function CarrinhoPage() {
  const { user } = useContext(AuthContext);
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user?.ID_utilizador) {
      fetch(`/api/carrinho?id_utilizador=${user.ID_utilizador}`)
        .then(res => res.json())
        .then(data => setItens(Array.isArray(data) ? data : []));
    }
  }, [user]);

  const removerItem = async (id_produto) => {
    await fetch("/api/carrinho/remover", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_utilizador: user.ID_utilizador, id_produto }),
    });
    setItens(prev => prev.filter(p => p.ID_produto !== id_produto));
  };

  const finalizarCompra = async () => {
    const confirmar = confirm("Deseja finalizar a compra?");
    if (!confirmar) return;

    setLoading(true);

    const res = await fetch("/api/compra", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_utilizador: user.ID_utilizador,
        userNome: user.Nome,
        userEmail: user.Email,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setItens([]);
      router.push("/compra-pendente");
    } else {
      alert(data.message || "Erro ao processar pedido.");
    }
  };

  const subtotal = itens.reduce((acc, item) => acc + item.Preco * item.Quantidade, 0);

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h2 className={styles.titulo}>🛒 Carrinho de Compras</h2>

        {itens.length === 0 ? (
          <div className={styles.vazio}>
            <img src="/vazio.png" alt="Carrinho vazio" />
            <p>O teu carrinho está vazio.</p>
            <a href="/" className={styles.btnVoltar}>Voltar à loja</a>
          </div>
        ) : (
          <div className={styles.conteudo}>
            <ul className={styles.lista}>
              {itens.map((item) => (
                <li key={item.ID_produto} className={styles.item}>
                  <img src={item.Foto || "/sem-foto.jpg"} alt={item.Nome_Produtos} />
                  <div className={styles.info}>
                    <h4>{item.Nome_Produtos}</h4>
                    <p><strong>Marca:</strong> {item.Marca}</p>
                    <p><strong>Quantidade:</strong> {item.Quantidade}</p>
                    <p><strong>Preço:</strong> {Number(item.Preco).toFixed(2)} €</p>
                    <button className={styles.btnRemover} onClick={() => removerItem(item.ID_produto)}>
                      Remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className={styles.resumo}>
              <h3>Resumo do Pedido</h3>
              <p>Total: <strong>{subtotal.toFixed(2)} €</strong></p>
              <button
                className={styles.btnCheckout}
                onClick={finalizarCompra}
                disabled={loading}
              >
                {loading ? "Finalizando..." : "Finalizar Compra"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
