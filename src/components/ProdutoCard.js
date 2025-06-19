// src/components/ProdutoCard.js
import styles from './produtoCard.module.css';

export default function ProdutoCard({ produto, onClick }) {
  const preco = parseFloat(produto.Preco) || 0;
  const desconto = parseFloat(produto.Desconto) || 0;
  const temDesconto = desconto > 0;
  const precoFinal = (preco - desconto).toFixed(2);

  // Caminho da imagem com fallback
  const imagemSrc =
    produto.Foto && produto.Foto.trim() !== ""
      ? produto.Foto.startsWith("/images/uploads/")
        ? produto.Foto
        : `/images/uploads/${produto.Foto.replace(/^\/+|\\+/g, '')}`
      : "/images/uploads/sem-imagem.png";

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.imagemContainer}>
        <img
          src={imagemSrc}
          alt={produto.Nome_Produtos}
          className={styles.imagem}
        />
      </div>

      <div className={styles.info}>
        <h3 className={styles.nome}>{produto.Nome_Produtos}</h3>
        <p className={styles.marca}>{produto.Marca}</p>

        <div className={styles.precoArea}>
          {temDesconto ? (
            <>
              <span className={styles.precoOriginal}>
                {preco.toFixed(2)}€
              </span>
              <span className={styles.precoComDesconto}>
                {precoFinal}€
              </span>
              <span className={styles.etiquetaDesconto}>
                -{desconto.toFixed(2)}€
              </span>
            </>
          ) : (
            <span className={styles.precoSemDesconto}>
              {preco.toFixed(2)}€
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
