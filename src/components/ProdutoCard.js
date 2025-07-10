import { useState, useEffect, useRef } from "react";
import styles from "./produtoCard.module.css";

export default function ProdutoCard({ produto, onClick, onAddToCart }) {
  const preco = parseFloat(produto.Preco) || 0;
  const desconto = parseFloat(produto.Desconto) || 0;
  const temDesconto = desconto > 0;
  const precoFinal = (preco - desconto).toFixed(2);

  // Fotos do produto ou imagem padrão
  const fotos = produto.fotos && produto.fotos.length > 0
    ? produto.fotos.map(f => f.url)
    : ["/images/uploads/sem-imagem.png"];

  // Estado para imagem principal (index)
  const [imagemAtiva, setImagemAtiva] = useState(0);
  const timerRef = useRef();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setImagemAtiva(oldIndex => (oldIndex + 1) % fotos.length);
    }, 4000);

    return () => clearInterval(timerRef.current);
  }, [fotos.length]);

  function handleMiniaturaClick(i) {
    clearInterval(timerRef.current);
    setImagemAtiva(i);
  }

  // Avaliação média (número entre 0 e 5) do produto
  const rating = produto.avaliacaoMedia || 0;

  // Função para renderizar estrelas
  function renderStars() {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<span key={i} className={styles.starFull}>★</span>);
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(<span key={i} className={styles.starHalf}>★</span>);
      } else {
        stars.push(<span key={i} className={styles.starEmpty}>☆</span>);
      }
    }
    return stars;
  }

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.imagemPrincipalContainer}>
        <img
          src={fotos[imagemAtiva]}
          alt={`${produto.Nome_Produtos} foto ${imagemAtiva + 1}`}
          className={styles.imagemPrincipal}
        />
      </div>

      <div className={styles.miniaturasContainer}>
        {fotos.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${produto.Nome_Produtos} miniatura ${i + 1}`}
            className={`${styles.miniatura} ${i === imagemAtiva ? styles.miniaturaAtiva : ""}`}
            onClick={() => handleMiniaturaClick(i)}
          />
        ))}
      </div>

      <div className={styles.info}>
        <h3 className={styles.nome}>{produto.Nome_Produtos}</h3>
        <p className={styles.marca}>{produto.Marca}</p>

        <div className={styles.rating}>{renderStars()}</div>

        <div className={styles.precoArea}>
          {temDesconto ? (
            <>
              <span className={styles.precoOriginal}>{preco.toFixed(2)}€</span>
              <span className={styles.precoComDesconto}>{precoFinal}€</span>
              <span className={styles.etiquetaDesconto}>-{desconto.toFixed(2)}€</span>
            </>
          ) : (
            <span className={styles.precoSemDesconto}>{preco.toFixed(2)}€</span>
          )}
        </div>

        <button
          type="button"
          className={styles.botaoCarrinho}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(produto);
          }}
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}
