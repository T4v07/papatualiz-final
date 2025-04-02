import { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import Navbar from "@/components/navbar";
import styles from "@/styles/carrinho.module.css";

export default function CarrinhoPage() {
  const { user } = useContext(AuthContext);
  const [itens, setItens] = useState([]);

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/carrinho?id_utilizador=${user.id}`)
        .then(res => res.json())
        .then(data => setItens(Array.isArray(data) ? data : []));
    }
  }, [user]);

  const removerItem = async (id_produto) => {
    await fetch("/api/carrinho/remover", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_utilizador: user.id,
        id_produto,
      }),
    });

    setItens(prev => prev.filter(p => p.ID_produto !== id_produto));
  };

  const finalizarCompra = async () => {
    const confirmar = confirm("Deseja mesmo finalizar a compra?");
    if (!confirmar) return;

    const res = await fetch("/api/compra", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_utilizador: user.id,
        produtos: itens.map(item => ({
          ID_produto: item.ID_produto,
          quantidade: item.Quantidade,
          Preco: item.Preco,
        })),
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      setItens([]);
    } else {
      alert("Erro ao finalizar compra.");
    }
  };

  const subtotal = Array.isArray(itens)
    ? itens.reduce((acc, item) => acc + item.Preco * item.Quantidade, 0)
    : 0;

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h2 className={styles.titulo}>Carrinho</h2>
        {itens.length === 0 ? (
          <div className={styles.vazio}>
            <img src="/vazio.png" alt="Carrinho vazio" />
            <p>O carrinho está vazio!</p>
            <a href="/" className={styles.btn}>Continuar a comprar</a>
          </div>
        ) : (
          <div className={styles.conteudo}>
            <ul className={styles.lista}>
              {itens.map((item) => (
                <li key={item.ID_produto} className={styles.item}>
                  <img src={item.Foto || "/sem-foto.jpg"} alt={item.Nome_Produtos} />
                  <div>
                    <h4>{item.Nome_Produtos}</h4>
                    <p>Marca: {item.Marca}</p>
                    <p>Quantidade: {item.Quantidade}</p>
                    <p>Preço: {item.Preco}€</p>
                    <button onClick={() => removerItem(item.ID_produto)}>Remover</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className={styles.resumo}>
              <h3>Resumo</h3>
              <p>Total: <strong>{subtotal.toFixed(2)} €</strong></p>
              <button className={styles.btnCheckout} onClick={finalizarCompra}>Finalizar Compra</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
