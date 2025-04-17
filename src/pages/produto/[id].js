import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import Navbar from "@/components/navbar";
import styles from "@/styles/produtoDetalhes.module.css";
import AuthContext from "@/context/AuthContext";

export default function ProdutoDetalhes() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useContext(AuthContext);
  const [produto, setProduto] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchProduto = async () => {
      try {
        const res = await fetch(`/api/produtos/${id}`);
        if (!res.ok) throw new Error("Produto não encontrado");
        const data = await res.json();
        setProduto(data);
      } catch (err) {
        setErro("Tenta voltar à loja e escolher outro produto.");
        console.error("Erro ao buscar produto:", err);
      }
    };

    fetchProduto();
  }, [id]);

  const adicionarCarrinho = async () => {
    if (!user) {
      alert("Tens de estar logado para adicionar ao carrinho.");
      return;
    }

    try {
      const res = await fetch("/api/carrinho", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ID_utilizador: user.ID_utilizador,
          ID_produto: produto.ID_produto,
          Quantidade: 1,
        }),
      });

      if (res.ok) {
        alert("Produto adicionado ao carrinho!");
      } else {
        alert("Erro ao adicionar ao carrinho.");
      }
    } catch (err) {
      console.error("Erro:", err);
      alert("Erro ao adicionar produto.");
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        {erro ? (
          <p>{erro}</p>
        ) : produto ? (
          <>
            <div className={styles.imagemContainer}>
              <img
                src={produto.Foto || "/images/no-image.png"}
                alt={produto.Nome_Produtos}
                className={styles.imagem}
              />
            </div>
            <div className={styles.detalhes}>
              <h2>{produto.Nome_Produtos}</h2>
              <p><strong>Modelo:</strong> {produto.Modelo}</p>
              <p><strong>Marca:</strong> {produto.Marca}</p>
              <p><strong>Cor:</strong> {produto.Cor}</p>
              <p><strong>Preço:</strong> €{parseFloat(produto.Preco).toFixed(2)}</p>
              <p className={styles.descricao}>{produto.Descricao}</p>

              <div className={styles.botoes}>
                <button onClick={adicionarCarrinho}>🛒 Adicionar ao Carrinho</button>
                <button disabled>❤️ Favoritar</button>
              </div>
            </div>
          </>
        ) : (
          <p>Carregando produto...</p>
        )}
      </div>
    </>
  );
}
