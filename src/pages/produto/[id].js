// pages/produto/[id].js
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import AuthContext from "@/context/AuthContext";
import Navbar from "@/components/navbar";
import styles from "@/styles/detalhesProduto.module.css";
import Link from "next/link";

export default function ProdutoDetalhes() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useContext(AuthContext);

  const [produto, setProduto] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/verprodutos/${id}`)
        .then((res) => res.json())
        .then((data) => setProduto(data))
        .catch((error) => console.error(error));
    }
  }, [id]);

  const adicionarCarrinho = async () => {
    if (!user?.ID_utilizador) return alert("Faz login primeiro.");
    await fetch("/api/carrinho/adicionar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_utilizador: user.ID_utilizador,
        id_produto: produto.ID_produto,
        quantidade: 1,
      }),
    });
    alert("Adicionado ao carrinho!");
  };

  if (!produto) return <p>A carregar...</p>;

  return (
    <>
      <Navbar />
      <div className={styles.breadcrumb}>
        <Link href="/"><span>🏠 Voltar para loja</span></Link> / {produto.Nome_Produtos}
      </div>

      <div className={styles.container}>
        <div className={styles.left}>
          <img src={produto.Foto} alt={produto.Nome_Produtos} className={styles.imagem} />
        </div>

        <div className={styles.right}>
          <h1>{produto.Nome_Produtos}</h1>
          <p className={styles.categoria}>{produto.Tipo_de_Produto}</p>
          <p className={styles.marca}>{produto.Marca} - {produto.Modelo}</p>
          <p className={styles.preco}>{parseFloat(produto.Preco).toFixed(2)} €</p>
          <p className={styles.stock}>
            {produto.Stock > 0 ? `Disponível (${produto.Stock} unidades)` : "Indisponível"}
          </p>
          <p className={styles.referencia}>Ref: #{produto.ID_produto}</p>

          <button onClick={adicionarCarrinho} className={styles.btnCarrinho}>🛒 Adicionar ao Carrinho</button>

          <div className={styles.descricao}>{produto.Descricao}</div>
        </div>
      </div>

      <div className={styles.fichaTecnica}>
        <h3>📘 Ficha Técnica</h3>
        <p>{produto.Ficha_Tecnica}</p>
      </div>

      
    </>
  );
}
