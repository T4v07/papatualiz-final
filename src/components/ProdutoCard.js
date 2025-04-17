// ProdutoCard.js
import Link from "next/link";
import styles from "@/styles/produtoCard.module.css";

export default function ProdutoCard({ produto, userId, favoritos, onToggleFavorito }) {
  const adicionarCarrinho = async () => {
    if (!userId) {
      alert("Faz login para adicionar ao carrinho.");
      return;
    }

    try {
      const res = await fetch("/api/carrinho/adicionar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_utilizador: userId,
          id_produto: produto.ID_produto,
          quantidade: 1,
        }),
      });

      if (res.ok) {
        alert("Adicionado ao carrinho!");
      } else {
        alert("Erro ao adicionar ao carrinho.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de sistema.");
    }
  };

  const isFavorito = favoritos.includes(produto.ID_produto);

  return (
    <div className={styles.card}>
      <Link href={`/produto/${produto.ID_produto}`}>
        <div className={styles.cardLink}>
          {produto.Foto ? (
            <img src={produto.Foto} alt={produto.Nome_Produtos} />
          ) : (
            <div className={styles.semImagem}>Sem imagem</div>
          )}
          <h3>{produto.Nome_Produtos}</h3>
          <p className={styles.marca}>{produto.Marca}</p>
          <p className={styles.preco}><strong>{parseFloat(produto.Preco).toFixed(2)} €</strong></p>
        </div>
      </Link>

      <div className={styles.acoes}>
        <button className={styles.botaoCarrinho} onClick={adicionarCarrinho}>
          Adicionar ao carrinho
        </button>
        {userId && (
          <button
            className={styles.favoritoBtn}
            onClick={() => onToggleFavorito(produto.ID_produto)}
            title="Favorito"
          >
            <img
              src={isFavorito ? "/images/coracaoadicpreenchido.jpg" : "/images/coracaoadic.jpg"}
              alt="Favorito"
              className={styles.coracao}
            />
          </button>
        )}
      </div>
    </div>
  );
}
