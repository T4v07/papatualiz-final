import styles from "@/styles/ProdutoCardFavorito.module.css";

export default function ProdutoCardFavorito({ produto, onToggleFavorito, onAddCarrinho }) {
  return (
    <div className={styles.card}>
      {produto.Foto ? (
        <img src={produto.Foto} alt={produto.Nome_Produtos} />
      ) : (
        <div className={styles.semImagem}>Sem imagem</div>
      )}

      <h3>{produto.Nome_Produtos}</h3>
      <p className={styles.marca}>{produto.Marca}</p>
      <p className={styles.preco}><strong>{parseFloat(produto.Preco).toFixed(2)} €</strong></p>

      <div className={styles.acoes}>
        <button className={styles.botaoCarrinho} onClick={() => onAddCarrinho(produto.ID_produto)}>
          Adicionar ao carrinho
        </button>
        <button className={styles.favoritoBtn} onClick={() => onToggleFavorito(produto.ID_produto)} title="Remover dos favoritos">
          <img
            src="/images/coracaoadic.jpg"
            alt="Favorito"
            className={styles.coracao}
          />
        </button>
      </div>
    </div>
  );
}
